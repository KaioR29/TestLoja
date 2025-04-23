from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/produto/<int:product_id>')
def product_details(product_id):
    return render_template('product.html')

if __name__ == '__main__':
    app.run(debug=True)
