/*First, we need a back end endpoint that will actually upload an image to the server.

And then we also need to add the front end so that we actually have an image input, we can select it

and then submit to that back end endpoint. */
import path from 'path';
import express from 'express';
import multer from 'multer';

const router = express.Router();

/*Now, before we even create our routes, we need to describe where we want our image to go, which storage

we want to use.

So we could use Amazon buckets or disk storage, which is what I want.  */
/*And then this takes in an object with a couple functions.

First is going to be destination.

So this will describe where we want to save this and notice that we pass in request file and CB So CB

is the callback that we want to call within destination.

The first argument of cb, null pertains to an error which we don't have an error, so we're going to put

Null for that.

And then the second is where we actually want our uploads to go, which is going to be in a folder called

uploads */
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  /*Now we want a file name function because we need to describe how

    we want our files to be, our file names to be formatted.

    So we're going to go ahead and call the callback pass in Null for the error.

    And then this is how we're going to create our file names.

    So it's going to be the field name, which can be anything really.

    We're just going to use image and then Dash and then whatever the timestamp is with date dot now and

    then we'll use whatever extension the file has, which could be Jpeg, PNG.

    We're actually going to have some validation so that we can only have image files, but it will use

    the extension name. */
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function fileFilter(req, file, cb) {
  /*
     we will have our extension name, set that to file types, which is this variable dot test.

    And then we're going to pass in the extension of the original file name and make it all lowercase. */
    /*we're just going to check the extension name and the mime type and 
    test is just to see if it's going to match our regular expression. */
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Images only!'), false);
  }
}

/*Now to do the actual upload, we're going to say const upload equals malter.

And in this object we're going to pass in our storage variable. */
const upload = multer({ storage, fileFilter });
const uploadSingleImage = upload.single('image');

/*upload.single('image') -this is the middleware
 we're using single because we only want to allow a single file and I'm calling it image.

But you could use anything here, but this is the field name.

When I say file dot, field name, it's going to be whatever I put here.

So in this route, we're just going to send a response dot send because the actual upload is handled by the middleware*/
router.post('/', (req, res) => {
  uploadSingleImage(req, res, function (err) {
    if (err) {
      return res.status(400).send({ message: err.message });
    }

    res.status(200).send({
      message: 'Image uploaded successfully',
      image: `/${req.file.path}`,
    });
  });
});

export default router;
