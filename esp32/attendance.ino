// =====================================================
//   SMART ATTENDANCE SYSTEM - ESP32
//   Tools -> Partition Scheme -> Huge APP (3MB No OTA)
//
//   Exit Reasons:
//   1 = Personal
//   2 = Meeting
//   3 = Field Work
//   4 = Day Close
//   5 = Purchase
// =====================================================

#include <Adafruit_Fingerprint.h>
#include <Wire.h>
#include <MCP7940.h>
#include <EEPROM.h>
#include <WiFi.h>
#include <HTTPClient.h>

// ================= CONFIG =================
#define FP_RX       14
#define FP_TX       27
#define MAX_USERS   50
#define EEPROM_SIZE 4096

#define WIFI_SSID  "OPPO A78 5G"
#define WIFI_PASS  "u7mwvniw"
#define FB_URL     "https://attendace-system-5599c-default-rtdb.firebaseio.com"

// ================= HARDWARE =================
HardwareSerial fingerSerial(2);
Adafruit_Fingerprint finger(&fingerSerial);
MCP7940_Class rtc;

// ================= USER STRUCT =================
struct UserData {
  char name[20];
  char phone[15];
  bool valid;
};

UserData users[MAX_USERS];
bool     loggedIn[MAX_USERS];
DateTime loginTime[MAX_USERS];

// ================= INPUT HELPERS =================
int readInt() {
  String s = "";
  while (!s.length()) {
    if (Serial.available()) { s = Serial.readStringUntil('\n'); s.trim(); }
  }
  return s.toInt();
}

String readStr() {
  String s = "";
  while (!s.length()) {
    if (Serial.available()) { s = Serial.readStringUntil('\n'); s.trim(); }
  }
  return s;
}

// ================= TIME HELPERS =================
String datStr(DateTime t) {
  char b[11];
  sprintf(b, "%04d-%02d-%02d", t.year(), t.month(), t.day());
  return String(b);
}

String timStr(DateTime t) {
  char b[9];
  sprintf(b, "%02d:%02d:%02d", t.hour(), t.minute(), t.second());
  return String(b);
}

// ================= FIREBASE PUT =================
void firebasePut(String path, String body) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println(F("x No WiFi"));
    return;
  }
  HTTPClient http;
  http.begin(String(FB_URL) + path + ".json");
  http.addHeader("Content-Type", "application/json");
  int code = http.PUT(body);
  Serial.println(code == 200 ? F("✓ Firebase OK") : F("x Firebase fail"));
  http.end();
}

// ================= FIREBASE POST =================
void firebasePost(String path, String body) {
  if (WiFi.status() != WL_CONNECTED) return;
  HTTPClient http;
  http.begin(String(FB_URL) + path + ".json");
  http.addHeader("Content-Type", "application/json");
  int code = http.POST(body);
  Serial.println(code == 200 ? F("✓ Firebase log OK") : F("x Firebase log fail"));
  http.end();
}

// ================= SETUP =================
void setup() {
  Serial.begin(115200);
  delay(500);
  EEPROM.begin(EEPROM_SIZE);
  Wire.begin(21, 22);

  // RTC
  if (!rtc.begin()) {
    Serial.println(F("x RTC not found"));
    while (1);
  }
  Serial.println(F("✓ RTC ready"));

  // Fingerprint
  fingerSerial.begin(57600, SERIAL_8N1, FP_RX, FP_TX);
  if (!finger.verifyPassword()) {
    Serial.println(F("x Fingerprint sensor fail"));
    while (1);
  }
  Serial.println(F("✓ Fingerprint ready"));

  // Load users from EEPROM
  for (int i = 1; i < MAX_USERS; i++) {
    EEPROM.get(i * sizeof(UserData), users[i]);
  }

  // WiFi
  Serial.print(F("Connecting WiFi"));
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  for (int i = 0; i < 20 && WiFi.status() != WL_CONNECTED; i++) {
    delay(500);
    Serial.print('.');
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println(F("\n✓ WiFi connected"));

    // NTP time sync (IST = UTC+5:30 = 19800 seconds)
    Serial.print(F("Syncing time"));
    configTime(19800, 0, "pool.ntp.org", "time.google.com");
    struct tm timeInfo;
    for (int i = 0; i < 15 && !getLocalTime(&timeInfo); i++) {
      delay(1000);
      Serial.print('.');
    }

    if (getLocalTime(&timeInfo)) {
      rtc.adjust(DateTime(
        timeInfo.tm_year + 1900,
        timeInfo.tm_mon  + 1,
        timeInfo.tm_mday,
        timeInfo.tm_hour,
        timeInfo.tm_min,
        timeInfo.tm_sec
      ));
      rtc.deviceStart();
      Serial.println(F("\n✓ RTC synced from internet"));
    } else {
      Serial.println(F("\nx NTP failed - using compile time"));
      rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
      rtc.deviceStart();
    }

  } else {
    Serial.println(F("\nx WiFi failed - using compile time"));
    rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
    rtc.deviceStart();
  }

  DateTime now = rtc.now();
  Serial.print(F("Time: "));
  Serial.print(datStr(now));
  Serial.print(F("  "));
  Serial.println(timStr(now));

  Serial.println(F("\n=== ATTENDANCE READY ==="));
  printMenu();
}

// ================= LOOP =================
void loop() {
  if (Serial.available()) {
    switch (Serial.read()) {
      case 'e': enrollUser(); break;
      case 'd': deleteUser(); break;
      case 'c': clearDB();    break;
      case 'l': showDB();     break;
      case 'm': printMenu();  break;
      case 't': showTime();   break;
    }
  }

  int id = scanFinger();
  if (id > 0 && users[id].valid) {
    processAttendance(id);
    delay(3000);
    printMenu();
  }
}

// ================= SHOW TIME =================
void showTime() {
  DateTime now = rtc.now();
  Serial.print(F("Time: "));
  Serial.print(datStr(now));
  Serial.print(F("  "));
  Serial.println(timStr(now));
}

// ================= MENU =================
void printMenu() {
  Serial.println(F("\n=== MENU: e=Enroll d=Delete c=Clear l=List t=Time ==="));
}

// ================= ENROLL =================
void enrollUser() {
  while (Serial.available()) Serial.read();
  delay(100);

  Serial.println(F("Enter ID (1-49):"));
  int id = readInt();
  if (id <= 0 || id >= MAX_USERS) { Serial.println(F("x Invalid ID")); printMenu(); return; }

  Serial.println(F("Name:"));  String name  = readStr();
  Serial.println(F("Phone:")); String phone = readStr();

  Serial.println(F("Place finger..."));
  while (finger.getImage() != FINGERPRINT_OK);
  if (finger.image2Tz(1) != FINGERPRINT_OK) { Serial.println(F("x Image 1 fail")); printMenu(); return; }

  Serial.println(F("Remove finger..."));
  delay(2000);
  while (finger.getImage() != FINGERPRINT_NOFINGER);

  Serial.println(F("Place same finger again..."));
  while (finger.getImage() != FINGERPRINT_OK);
  if (finger.image2Tz(2)   != FINGERPRINT_OK) { Serial.println(F("x Image 2 fail")); printMenu(); return; }
  if (finger.createModel()  != FINGERPRINT_OK) { Serial.println(F("x Finger mismatch")); printMenu(); return; }

  if (finger.storeModel(id) == FINGERPRINT_OK) {
    name.toCharArray(users[id].name,   20);
    phone.toCharArray(users[id].phone, 15);
    users[id].valid = true;
    EEPROM.put(id * sizeof(UserData), users[id]);
    EEPROM.commit();

    // Save user profile to Firebase
    firebasePut("/users/" + String(id),
      "{\"id\":"        + String(id) +
      ",\"name\":\""    + name       +
      "\",\"phone\":\"" + phone      + "\"}");

    Serial.println(F("✓ User enrolled"));
  }
  printMenu();
}

// ================= DELETE =================
void deleteUser() {
  Serial.println(F("Enter ID to delete:"));
  int id = readInt();

  if (finger.deleteModel(id) == FINGERPRINT_OK) {
    users[id].valid = false;
    EEPROM.put(id * sizeof(UserData), users[id]);
    EEPROM.commit();

    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      http.begin(String(FB_URL) + "/users/" + String(id) + ".json");
      http.sendRequest("DELETE");
      http.end();
    }
    Serial.println(F("✓ User deleted"));
  } else {
    Serial.println(F("x Delete failed"));
  }
  printMenu();
}

// ================= CLEAR =================
void clearDB() {
  finger.emptyDatabase();
  for (int i = 0; i < MAX_USERS; i++) {
    users[i].valid = false;
    EEPROM.put(i * sizeof(UserData), users[i]);
  }
  EEPROM.commit();
  Serial.println(F("✓ Database cleared"));
  printMenu();
}

// ================= SHOW USERS =================
void showDB() {
  Serial.println(F("\n=== USERS ==="));
  for (int i = 1; i < MAX_USERS; i++) {
    if (users[i].valid) {
      Serial.printf("  %d | %s | %s\n", i, users[i].name, users[i].phone);
    }
  }
  Serial.println(F("============="));
  printMenu();
}

// ================= SCAN FINGER =================
int scanFinger() {
  if (finger.getImage()     != FINGERPRINT_OK) return -1;
  if (finger.image2Tz()     != FINGERPRINT_OK) return -1;
  if (finger.fingerSearch() != FINGERPRINT_OK) {
    Serial.println(F("x Unknown finger"));
    return -1;
  }
  return finger.fingerID;
}

// ================= PROCESS ATTENDANCE =================
void processAttendance(int id) {
  DateTime now = rtc.now();

  if (!loggedIn[id]) {

    // ===== LOGIN =====
    loggedIn[id]  = true;
    loginTime[id] = now;

    Serial.print(F("\n✓ LOGIN -> "));
    Serial.println(users[id].name);
    Serial.print(F("Time: "));
    Serial.print(datStr(now));
    Serial.print(F("  "));
    Serial.println(timStr(now));

    String json =
      "{\"type\":\"login\""
      ",\"id\":"      + String(id) +
      ",\"name\":\""  + String(users[id].name)  + "\""
      ",\"phone\":\"" + String(users[id].phone) + "\""
      ",\"date\":\""  + datStr(now) + "\""
      ",\"time\":\""  + timStr(now) + "\""
      ",\"hour\":"    + String(now.hour()) +
      ",\"minute\":"  + String(now.minute()) +
      "}";

    firebasePost("/attendance_log", json);

  } else {

    // ===== LOGOUT =====
    loggedIn[id] = false;

    Serial.print(F("\n✓ LOGOUT -> "));
    Serial.println(users[id].name);
    Serial.print(F("Time: "));
    Serial.print(datStr(now));
    Serial.print(F("  "));
    Serial.println(timStr(now));

    // Reason selection
    Serial.println(F("Select Reason:"));
    Serial.println(F("1 = Personal"));
    Serial.println(F("2 = Meeting"));
    Serial.println(F("3 = Field Work"));
    Serial.println(F("4 = Day Close"));
    Serial.println(F("5 = Purchase"));

    char r = readStr()[0];
    const char* reasons[] = {"Unknown","Personal","Meeting","Field Work","Day Close","Purchase"};
    String reason = (r >= '1' && r <= '5') ? reasons[r - '0'] : reasons[0];
    Serial.print(F("Reason: "));
    Serial.println(reason);

    // Estimated time for Field Work and Purchase
    int estMinutes = 0;
    if (reason == "Field Work" || reason == "Purchase") {
      Serial.println(F("Enter estimated return time (minutes, 0 if none):"));
      estMinutes = readInt();
    }

    // Work duration
    TimeSpan work     = now - loginTime[id];
    long     workMins = (long)work.hours() * 60 + work.minutes();

    // Personal time is excluded from working time count
    // For Field Work / Purchase with estimated time: count estimated time as working
    // For Personal: workMins contributes 0 to productive work
    long     productiveMins = 0;
    if (reason == "Personal") {
      productiveMins = 0;
    } else if ((reason == "Field Work" || reason == "Purchase") && estMinutes > 0) {
      productiveMins = estMinutes;
    } else {
      productiveMins = workMins;
    }

    Serial.printf("Work Time: %ldh %ldm\n", workMins / 60, workMins % 60);
    Serial.printf("Productive: %ldh %ldm\n", productiveMins / 60, productiveMins % 60);

    // Build JSON
    String json =
      "{\"type\":\"logout\""
      ",\"id\":"                + String(id) +
      ",\"name\":\""            + String(users[id].name)  + "\""
      ",\"phone\":\""           + String(users[id].phone) + "\""
      ",\"date\":\""            + datStr(now)              + "\""
      ",\"login_time\":\""      + timStr(loginTime[id])    + "\""
      ",\"logout_time\":\""     + timStr(now)              + "\""
      ",\"reason\":\""          + reason                   + "\""
      ",\"work_minutes\":"      + String(workMins)         +
      ",\"productive_minutes\":" + String(productiveMins)  +
      ",\"est_minutes\":"       + String(estMinutes)       +
      ",\"hour\":"              + String(now.hour())       +
      ",\"minute\":"            + String(now.minute())     +
      "}";

    // POST unique record
    firebasePost("/attendance_log", json);

    // PUT daily summary (overwrites latest for this user+date)
    firebasePut(
      "/daily_summary/" + datStr(now) + "/" + String(id),
      "{\"id\":"                + String(id) +
      ",\"name\":\""            + String(users[id].name)  + "\""
      ",\"date\":\""            + datStr(now)              + "\""
      ",\"login_time\":\""      + timStr(loginTime[id])    + "\""
      ",\"logout_time\":\""     + timStr(now)              + "\""
      ",\"reason\":\""          + reason                   + "\""
      ",\"work_minutes\":"      + String(workMins)         +
      ",\"productive_minutes\":" + String(productiveMins)  +
      ",\"est_minutes\":"       + String(estMinutes)       +
      "}"
    );
  }
}
