import sqlite3 as sql

"""
This file is just like a sbx env for people to test their sqlite changes with
"""

db = sql.connect('credentials.db')

# db.execute("""
# CREATE TABLE CREDENTIALS
#            (ID INTEGER PRIMARY KEY,
#             UNAME TEXT NOT NULL,
#             PWD TEXT NOT NULL,
#             EMAIL TEXT NOT NULL);

# """)

# db.execute("""
# INSERT INTO CREDENTIALS (UNAME, PWD, EMAIL)
# VALUES ('apeter40', 'testPassword123!', 'apeter40@gmu.edu')
# """)

# db.commit()

cursor = db.execute("SELECT ID, UNAME, PWD, EMAIL from CREDENTIALS  WHERE UNAME=(?);", ['testUser1']).fetchall()

print(cursor)

# for row in cursor:
#     print("***************")
#     print(f'ID:    {row[0]}')
#     print(f'UNAME: {row[1]}')
#     print(f'PWD:   {row[2]}')
#     print(f'EMAIL: {row[3]}')
#     print("***************")



# db.close()