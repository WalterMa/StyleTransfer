import os
from flask import Flask, request, render_template, url_for, flash, redirect, send_from_directory, abort, safe_join
from werkzeug.utils import secure_filename
import mxnet as mx

from model import net
from model import utils

# model params
NGF = 128
CTX = mx.cpu(0)
MODEL = None
STYLES = None
PARAMS_PATH = os.path.join(os.getcwd(), 'model/params/21styles.params')
STYLE_SIZE = 512
CONTENT_SIZE = 512
STYLE_FOLDER = 'model/images/styles/'
STYLE_IMAGES = ['candy.jpg', 'composition_vii.jpg', 'escher_sphere.jpg', 'feathers.jpg', 'frida_kahlo.jpg',
                'la_muse.jpg', 'mosaic.jpg', 'mosaic_ducks_massimo.jpg', 'pencil.jpg', 'picasso_selfport1907.jpg',
                'portrait_of_jean_metzinger.jpg', 'rain_princess.jpg', 'seated_nude.jpg', 'shipwreck.jpg',
                'starry_night.jpg', 'stars2.jpg', 'strip.jpg', 'the_scream.jpg', 'udnie.jpg', 'wave.jpg',
                'woman-with-hat-matisse.jpg']

# app params
ALLOWED_EXTENSIONS = ['png', 'jpg', 'jpeg']
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'images/upload')
OUTPUT_FOLDER = os.path.join(os.getcwd(), 'images/gen')

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['OUTPUT_FOLDER'] = OUTPUT_FOLDER


@app.route('/')
def hello_world():
    return render_template('info.html', info='Hello World!')


@app.route('/upload', methods=['POST', 'GET'])
def upload_image():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        img_file = request.files['file']
        # if user does not select file, browser also
        # submit a empty part without filename
        if img_file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if img_file and allowed_file(img_file.filename):
            filename = secure_filename(img_file.filename)
            img_file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            return redirect(url_for('uploaded_image',
                                    filename=filename))
    return '''
        <!doctype html>
        <title>Upload new File</title>
        <h1>Upload new File</h1>
        <form method=post enctype=multipart/form-data>
          <p><input type=file name=file>
             <input type=submit value=Upload>
        </form>
        '''


@app.route('/upload/<filename>')
def uploaded_image(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'],
                               filename)


@app.route('/process', methods=['GET'])
def process():
    global MODEL
    global STYLES

    style_num = int(request.args.get('style', '-1'))
    img_name = request.args.get('image', '')

    if style_num > len(STYLES) or style_num < 0 or img_name == '':
        abort(400)

    gen_img_name = img_name.rsplit('.')[0] + '-style-' + str(style_num) + '.jpg'
    if not os.path.exists(os.path.join(OUTPUT_FOLDER, gen_img_name)):
        img_path = safe_join(UPLOAD_FOLDER, img_name)
        content_image = utils.tensor_load_rgbimage(img_path, CTX, size=CONTENT_SIZE, keep_asp=True)
        MODEL.setTarget(STYLES[style_num])
        output = MODEL(content_image)
        utils.tensor_save_bgrimage(output[0], safe_join(OUTPUT_FOLDER, gen_img_name))
    return redirect(url_for('generated_image',
                            filename=gen_img_name))


@app.route('/gen/<filename>')
def generated_image(filename):
    return send_from_directory(app.config['OUTPUT_FOLDER'],
                               filename)


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def init_model():
    global MODEL
    global STYLES
    MODEL = net.Net(ngf=NGF)
    MODEL.collect_params().load(PARAMS_PATH, ctx=CTX)
    STYLES = []
    for style_name in STYLE_IMAGES:
        style_path = os.path.join(os.getcwd(), STYLE_FOLDER, style_name)
        style_image = utils.tensor_load_rgbimage(style_path, CTX, size=STYLE_SIZE)
        style_image = utils.preprocess_batch(style_image)
        STYLES.append(style_image)
    return

if __name__ == '__main__':
    init_model()
    app.run()
