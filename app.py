from flask import Flask, render_template, request
import yaml
import mysql.connector

app = Flask(__name__)

# Load database configuration from YAML file
db = yaml.load(open('db.yaml'), Loader=yaml.FullLoader)

# Create a MySQL connection
mysql_connection = mysql.connector.connect(
    host=db['MYSQL_HOST'],
    user=db['MYSQL_USER'],
    password=db['MYSQL_PASSWORD'],
    database=db['MYSQL_DB']
)

def addMaterial(event):
    # Prevent the default form submission
    event.preventDefault()

    # Retrieve form data
    materialTitle = request.form['material-title']
    materialUrl = request.form['material-url']

    # Create a cursor for executing queries
    cursor = mysql_connection.cursor()

    # Execute the INSERT query
    cursor.execute(
        '''
        INSERT INTO study_materials (title, url)
        VALUES (%s, %s)
        ''',
        (materialTitle, materialUrl)
    )

    # Commit the transaction
    mysql_connection.commit()

    # Refresh the material list after adding the new material
    cursor.execute('SELECT * FROM study_materials')
    materials = cursor.fetchall()

    # Close the cursor
    cursor.close()

    # Render the template with the updated materials list
    return render_template('index.html', materials=materials)

def fetchMaterials():
    # Create a cursor for executing queries
    cursor = mysql_connection.cursor()

    # Execute the SELECT query
    cursor.execute('SELECT * FROM study_materials')
    materials = cursor.fetchall()

    # Close the cursor
    cursor.close()

    # Render the template with the materials list
    return render_template('index.html', materials=materials)

@app.route('/')
def index():
    return fetchMaterials()

if __name__ == '__main__':
    app.run(debug=True, port=7000)
