##  Web APP for MXNet Gluon Style Transfer

Build on the repo: [MXNet-Gluon-Style-Transfer](https://github.com/zhanghang1989/MXNet-Gluon-Style-Transfer)

This repo create a style transfer web app using mxnet gluon api and python.

- Backend: flask
- Frontend: jquery+bootstrap
- Model parameters from [link](https://apache-mxnet.s3-accelerate.amazonaws.com/gluon/models/21styles-32f7205c5.params)

### Prerequisites

*Only Tested on Python 2.7 environment*

Require Python package：mxnet, flask

Install packages (with CUDA 8.0 installed first):

```bash
pip install mxnet-cu80 flask
```

or (use CPU only)

```bash
pip install mxnet flask
```

### How to run?

**Note: Default use CPU to compute, modify app.py line12 `CTX=mx.cpu(0)` to `CTX=mx.gpu(0)` to enable GPU computing**

Start server:

```bash
python app.py
```

Go to http://127.0.0.1:5000 , and have fun!