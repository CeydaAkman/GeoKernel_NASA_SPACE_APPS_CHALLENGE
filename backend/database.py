<<<<<<< HEAD
import hashlib
import json
import os
import sqlite3


# ============================================================
# DATABASE AYARLARI
# ============================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "geokernel.db")


# ============================================================
# VARSAYILAN DEMO TARLALAR
# ============================================================
=======

import hashlib
import os
import sqlite3
import json

DB_PATH = os.path.join(os.path.dirname(__file__), "geokernel.db")
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522

DEFAULT_PILOT_FIELDS = [
    {
        "name": "Kızıltepe Ovası Parseli (Mardin)",
        "city": "Mardin",
        "district": "Kızıltepe",
        "lat": 37.18,
        "lon": 40.58,
        "crop": "Kırmızı Mercimek",
    },
    {
        "name": "Viranşehir Kuzey Parseli (Şanlıurfa)",
        "city": "Şanlıurfa",
        "district": "Viranşehir",
        "lat": 37.23,
        "lon": 39.76,
        "crop": "Makarnalık Buğday",
    },
    {
        "name": "Bismil Kuru Tarım Parseli (Diyarbakır)",
        "city": "Diyarbakır",
        "district": "Bismil",
        "lat": 37.84,
        "lon": 40.66,
        "crop": "Arpa",
    },
]


<<<<<<< HEAD
# ============================================================
# DATABASE BAĞLANTISI
# ============================================================

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row

    # Foreign key kontrollerini aktif et
    conn.execute("PRAGMA foreign_keys = ON")

    return conn


# ============================================================
# ŞİFRE HASH
# ============================================================

def hash_password(password: str) -> str:
    return hashlib.sha256(
        password.encode("utf-8")
    ).hexdigest()


# ============================================================
# DEMO KULLANICI TARLALARINI EKLE
# ============================================================

def seed_user_fields(cursor, user_id: int):

    for field in DEFAULT_PILOT_FIELDS:

        cursor.execute(
            """
            INSERT INTO fields (
                user_id,
                name,
                city,
                district,
                lat,
                lon,
                crop
            )
=======
def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def seed_user_fields(cursor, user_id: int):
    for f in DEFAULT_PILOT_FIELDS:
        cursor.execute(
            """
            INSERT INTO fields (user_id, name, city, district, lat, lon, crop)
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                user_id,
<<<<<<< HEAD
                field["name"],
                field["city"],
                field["district"],
                field["lat"],
                field["lon"],
                field["crop"],
=======
                f["name"],
                f["city"],
                f["district"],
                f["lat"],
                f["lon"],
                f["crop"],
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
            ),
        )


<<<<<<< HEAD
# ============================================================
# DATABASE TABLOLARINI OLUŞTUR
# ============================================================

def init_db():

    conn = get_connection()
    cursor = conn.cursor()

    try:

        # ----------------------------------------------------
        # USERS
        # ----------------------------------------------------

        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                full_name TEXT NOT NULL,
                farm_name TEXT NOT NULL,
                city TEXT NOT NULL,
                identifier TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """
        )

        # ----------------------------------------------------
        # FIELDS
        # ----------------------------------------------------

        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS fields (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                city TEXT DEFAULT '',
                district TEXT DEFAULT '',
                lat REAL NOT NULL,
                lon REAL NOT NULL,
                crop TEXT DEFAULT 'Makarnalık Buğday',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                FOREIGN KEY (user_id)
                    REFERENCES users(id)
                    ON DELETE CASCADE
            )
            """
        )

        # ----------------------------------------------------
        # PLANS
        # ----------------------------------------------------

        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS plans (
                id INTEGER PRIMARY KEY AUTOINCREMENT,

                user_id INTEGER NOT NULL,
                field_id INTEGER NOT NULL,

                crop TEXT NOT NULL,

                operations_json TEXT NOT NULL,
                statuses_json TEXT NOT NULL,

                rating TEXT,
                feedback TEXT,

                yield_value REAL,
                yield_unit TEXT DEFAULT 'kg/da',

                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                completed_at TIMESTAMP,

                FOREIGN KEY (user_id)
                    REFERENCES users(id)
                    ON DELETE CASCADE,

                FOREIGN KEY (field_id)
                    REFERENCES fields(id)
                    ON DELETE CASCADE
            )
            """
        )

        # ----------------------------------------------------
        # DEMO KULLANICI
        # ----------------------------------------------------

        cursor.execute(
            """
            SELECT id
            FROM users
            WHERE identifier = ?
            """,
            ("demo@geokernel.org",)
        )

        demo_user = cursor.fetchone()

        if not demo_user:

            cursor.execute(
                """
                INSERT INTO users (
                    full_name,
                    farm_name,
                    city,
                    identifier,
                    password_hash
                )
                VALUES (?, ?, ?, ?, ?)
                """,
                (
                    "Ahmet Demir",
                    "Demir Kuru Tarım Çiftliği",
                    "Şanlıurfa",
                    "demo@geokernel.org",
                    hash_password("123456"),
                ),
            )

            demo_id = cursor.lastrowid

            seed_user_fields(
                cursor,
                demo_id
            )

        conn.commit()

    except Exception:

        conn.rollback()
        raise

    finally:

        conn.close()


# ============================================================
# KULLANICI KAYDI
# ============================================================

def register_user_db(
    full_name,
    farm_name,
    city,
    identifier,
    password,
):

    conn = None

    try:

        clean_name = str(full_name or "").strip()
        clean_farm = str(farm_name or "").strip()
        clean_city = str(city or "").strip() or "Şanlıurfa"
        clean_identifier = str(identifier or "").strip().lower()

        # Şifreyi strip etmiyoruz
        raw_password = str(password or "")

        if not clean_name:
            return None, "Ad soyad boş olamaz."

        if not clean_identifier:
            return None, "E-posta veya telefon numarası boş olamaz."

        if len(raw_password) < 4:
            return None, "Şifre en az 4 karakter olmalıdır."

        if not clean_farm:
            clean_farm = f"{clean_name} Çiftliği"

        conn = get_connection()
        cursor = conn.cursor()

        # Aynı kullanıcı daha önce kayıtlı mı?
        cursor.execute(
            """
            SELECT id
            FROM users
            WHERE lower(identifier) = ?
            """,
            (clean_identifier,)
        )

        if cursor.fetchone():

            return (
                None,
                "Bu e-posta veya telefon numarası zaten kayıtlı."
            )

        password_hash = hash_password(
            raw_password
        )

        cursor.execute(
            """
            INSERT INTO users (
                full_name,
                farm_name,
                city,
                identifier,
                password_hash
            )
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                clean_name,
                clean_farm,
                clean_city,
                clean_identifier,
                password_hash,
            ),
        )

        user_id = cursor.lastrowid

        conn.commit()

        return {
            "id": user_id,
            "fullName": clean_name,
            "farmName": clean_farm,
            "city": clean_city,
            "identifier": clean_identifier,
        }, None

    except sqlite3.IntegrityError:

        if conn:
            conn.rollback()

        return (
            None,
            "Bu e-posta veya telefon numarası zaten kayıtlı."
        )

    except Exception as error:

        if conn:
            conn.rollback()

        print(
            "Kayıt hatası:",
            error
        )

        return (
            None,
            f"Kayıt sırasında hata oluştu: {str(error)}"
        )

    finally:

        if conn:
            conn.close()


# ============================================================
# GİRİŞ
# ============================================================

def login_user_db(
    identifier,
    password,
):

    conn = None

    try:

        clean_identifier = str(
            identifier or ""
        ).strip().lower()

        raw_password = str(
            password or ""
        )

        if not clean_identifier:
            return None

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT
                id,
                full_name,
                farm_name,
                city,
                identifier,
                password_hash

            FROM users

            WHERE lower(identifier) = ?
            """,
            (clean_identifier,)
        )

        row = cursor.fetchone()

        if not row:

            print(
                "Giriş başarısız: Kullanıcı bulunamadı"
            )

            return None

        entered_password_hash = hash_password(
            raw_password
        )

        if row["password_hash"] != entered_password_hash:

            print(
                "Giriş başarısız: Şifre eşleşmedi"
            )

            return None

        return {
            "id": row["id"],
            "fullName": row["full_name"],
            "farmName": row["farm_name"],
            "city": row["city"],
            "identifier": row["identifier"],
        }

    except Exception as error:

        print(
            "Giriş hatası:",
            error
        )

        return None

    finally:

        if conn:
            conn.close()


# ============================================================
# KULLANICININ TARLALARINI GETİR
# ============================================================

def get_fields_by_user_db(user_id):

    conn = get_connection()
    cursor = conn.cursor()

    try:

        cursor.execute(
            """
            SELECT
                id,
                name,
                city,
                district,
                lat,
                lon,
                crop

            FROM fields

            WHERE user_id = ?

            ORDER BY id DESC
            """,
            (user_id,)
        )

        rows = cursor.fetchall()

        return [
            {
                "id": row["id"],
                "name": row["name"],
                "city": row["city"],
                "district": row["district"],
                "lat": row["lat"],
                "lon": row["lon"],
                "crop": row["crop"],
            }
            for row in rows
        ]

    finally:

        conn.close()


# ============================================================
# TARLA EKLE
# ============================================================

def create_field_db(
    user_id,
    name,
    city,
    district,
    lat,
    lon,
    crop="Makarnalık Buğday",
):

    conn = get_connection()
    cursor = conn.cursor()

    try:

        cursor.execute(
            """
            INSERT INTO fields (
                user_id,
                name,
                city,
                district,
                lat,
                lon,
                crop
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                user_id,
                name,
                city or "",
                district or "",
                lat,
                lon,
                crop or "Makarnalık Buğday",
            ),
        )

        new_id = cursor.lastrowid

        conn.commit()

        return {
            "id": new_id,
            "name": name,
            "city": city or "",
            "district": district or "",
            "lat": lat,
            "lon": lon,
            "crop": crop or "Makarnalık Buğday",
        }

    except Exception:

        conn.rollback()
        raise

    finally:

        conn.close()


# ============================================================
# PLAN KAYDET
# ============================================================
=======
def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT NOT NULL,
            farm_name TEXT NOT NULL,
            city TEXT NOT NULL,
            identifier TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS fields (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            city TEXT DEFAULT '',
            district TEXT DEFAULT '',
            lat REAL NOT NULL,
            lon REAL NOT NULL,
            crop TEXT DEFAULT 'Makarnalık Buğday',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
    """)

    # Yeni: Sezonluk plan geçmişi
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS plans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            field_id INTEGER NOT NULL,
            crop TEXT NOT NULL,
            operations_json TEXT NOT NULL,
            statuses_json TEXT NOT NULL,
            rating TEXT,
            feedback TEXT,
            yield_value REAL,
            yield_unit TEXT DEFAULT 'kg/da',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            completed_at TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (field_id) REFERENCES fields (id)
        )
    """)

    cursor.execute(
        "SELECT id FROM users WHERE identifier = ?",
        ("demo@geokernel.org",)
    )

    if not cursor.fetchone():
        cursor.execute("""
            INSERT INTO users
            (full_name, farm_name, city, identifier, password_hash)
            VALUES (?, ?, ?, ?, ?)
        """, (
            "Ahmet Demir",
            "Demir Kuru Tarım Çiftliği",
            "Şanlıurfa",
            "demo@geokernel.org",
            hash_password("123456"),
        ))

        demo_id = cursor.lastrowid
        seed_user_fields(cursor, demo_id)

    conn.commit()
    conn.close()


def register_user_db(full_name, farm_name, city, identifier, password):
    conn = get_connection()
    cursor = conn.cursor()

    clean_id = identifier.strip().lower()

    cursor.execute(
        "SELECT id FROM users WHERE lower(identifier) = ?",
        (clean_id,)
    )

    if cursor.fetchone():
        conn.close()
        return None, "Bu e-posta veya telefon numarası zaten kayıtlı."

    clean_name = full_name.strip()
    clean_farm = farm_name.strip() or f"{clean_name} Çiftliği"

    cursor.execute("""
        INSERT INTO users
        (full_name, farm_name, city, identifier, password_hash)
        VALUES (?, ?, ?, ?, ?)
    """, (
        clean_name,
        clean_farm,
        city,
        identifier.strip(),
        hash_password(password),
    ))

    user_id = cursor.lastrowid
    
    # ❌ BURAYI KALDIRIN VEYA YORUMA ALIN:
    # seed_user_fields(cursor, user_id)

    conn.commit()
    conn.close()

    return {
        "id": user_id,
        "fullName": clean_name,
        "farmName": clean_farm,
        "city": city,
        "identifier": identifier.strip(),
    }, None

def login_user_db(identifier, password):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, full_name, farm_name, city, identifier, password_hash
        FROM users
        WHERE lower(identifier) = ?
    """, (identifier.strip().lower(),))

    row = cursor.fetchone()
    conn.close()

    if not row or row["password_hash"] != hash_password(password):
        return None

    return {
        "id": row["id"],
        "fullName": row["full_name"],
        "farmName": row["farm_name"],
        "city": row["city"],
        "identifier": row["identifier"],
    }


def get_fields_by_user_db(user_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, name, city, district, lat, lon, crop
        FROM fields
        WHERE user_id = ?
        ORDER BY id DESC
    """, (user_id,))

    rows = cursor.fetchall()
    conn.close()

    return [
        {
            "id": row["id"],
            "name": row["name"],
            "city": row["city"],
            "district": row["district"],
            "lat": row["lat"],
            "lon": row["lon"],
            "crop": row["crop"],
        }
        for row in rows
    ]


def create_field_db(user_id, name, city, district, lat, lon, crop="Makarnalık Buğday"):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO fields
        (user_id, name, city, district, lat, lon, crop)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (user_id, name, city, district, lat, lon, crop))

    new_id = cursor.lastrowid
    conn.commit()
    conn.close()

    return {
        "id": new_id,
        "name": name,
        "city": city,
        "district": district,
        "lat": lat,
        "lon": lon,
        "crop": crop,
    }

>>>>>>> d270ed024f92099877e93a23c188ff36246eb522

def save_plan_db(
    user_id,
    field_id,
    crop,
    operations,
    statuses,
    rating,
    feedback,
    yield_value,
    yield_unit="kg/da",
):
<<<<<<< HEAD

    conn = get_connection()
    cursor = conn.cursor()

    try:

        # ====================================================
        # ÖNEMLİ:
        # BURADA ESKİ HATALI "fieFrlds" YERİNE "fields"
        # KULLANILIYOR
        # ====================================================

        cursor.execute(
            """
            SELECT id
            FROM fields
            WHERE id = ?
              AND user_id = ?
            """,
            (
                field_id,
                user_id,
            ),
        )

        field = cursor.fetchone()

        if not field:

            raise ValueError(
                "Tarla bulunamadı veya bu kullanıcıya ait değil."
            )

        # ----------------------------------------------------
        # PLAN KAYDI
        # ----------------------------------------------------

        cursor.execute(
            """
            INSERT INTO plans (

                user_id,
                field_id,
                crop,

                operations_json,
                statuses_json,

                rating,
                feedback,

                yield_value,
                yield_unit,

                completed_at
            )

            VALUES (
                ?, ?, ?,
                ?, ?,
                ?, ?,
                ?, ?,
                CURRENT_TIMESTAMP
            )
            """,
            (
                user_id,
                field_id,
                crop,

                json.dumps(
                    operations,
                    ensure_ascii=False
                ),

                json.dumps(
                    statuses,
                    ensure_ascii=False
                ),

                rating,
                feedback,

                yield_value,
                yield_unit,
            ),
        )

        plan_id = cursor.lastrowid

        conn.commit()

        return plan_id

    except Exception:

        conn.rollback()
        raise

    finally:

        conn.close()


# ============================================================
# TARLANIN PLAN GEÇMİŞİ
# ============================================================

def get_field_plans_db(
    user_id,
    field_id,
):

    conn = get_connection()
    cursor = conn.cursor()

    try:

        cursor.execute(
            """
            SELECT *

            FROM plans

            WHERE user_id = ?
              AND field_id = ?

            ORDER BY id DESC
            """,
            (
                user_id,
                field_id,
            ),
        )

        rows = cursor.fetchall()

        results = []

        for row in rows:

            try:
                operations = json.loads(
                    row["operations_json"]
                )
            except (
                TypeError,
                json.JSONDecodeError,
            ):
                operations = []

            try:
                statuses = json.loads(
                    row["statuses_json"]
                )
            except (
                TypeError,
                json.JSONDecodeError,
            ):
                statuses = {}

            results.append(
                {
                    "id": row["id"],

                    "fieldId": row["field_id"],

                    "crop": row["crop"],

                    "operations": operations,

                    "statuses": statuses,

                    "rating": row["rating"],

                    "feedback": row["feedback"],

                    "yieldValue": row["yield_value"],

                    "yieldUnit": row["yield_unit"],

                    "createdAt": row["created_at"],

                    "completedAt": row["completed_at"],
                }
            )

        return results

    finally:

        conn.close()
=======
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT id FROM fields WHERE id = ? AND user_id = ?",
        (field_id, user_id)
    )

    if not cursor.fetchone():
        conn.close()
        raise ValueError("Tarla bulunamadı veya bu kullanıcıya ait değil.")

    cursor.execute("""
        INSERT INTO plans (
            user_id, field_id, crop,
            operations_json, statuses_json,
            rating, feedback, yield_value, yield_unit,
            completed_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    """, (
        user_id,
        field_id,
        crop,
        json.dumps(operations, ensure_ascii=False),
        json.dumps(statuses, ensure_ascii=False),
        rating,
        feedback,
        yield_value,
        yield_unit,
    ))

    plan_id = cursor.lastrowid
    conn.commit()
    conn.close()

    return plan_id


def get_field_plans_db(user_id, field_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT *
        FROM plans
        WHERE user_id = ? AND field_id = ?
        ORDER BY id DESC
    """, (user_id, field_id))

    rows = cursor.fetchall()
    conn.close()

    results = []

    for row in rows:
        results.append({
            "id": row["id"],
            "fieldId": row["field_id"],
            "crop": row["crop"],
            "operations": json.loads(row["operations_json"]),
            "statuses": json.loads(row["statuses_json"]),
            "rating": row["rating"],
            "feedback": row["feedback"],
            "yieldValue": row["yield_value"],
            "yieldUnit": row["yield_unit"],
            "createdAt": row["created_at"],
            "completedAt": row["completed_at"],
        })

    return results
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
