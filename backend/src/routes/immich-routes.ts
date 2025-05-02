import multer from "multer";
import axios from "axios";
import path from "path";
import express from "express";

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Set the destination folder for uploaded images
    cb(null, "./uploads"); // You can change this to your desired directory
  },
  filename: (req, file, cb) => {
    // Generate a unique filename based on the original file name and current timestamp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// Create multer instance with file validation (only allow image files)
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max file size: 5MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true); // Continue with the upload
    } else {
      // Create an error object to pass to the callback instead of a string
      return cb(null, false);
    }
  },
}).single("image"); // 'image' is the name of the field in the form

const router = express.Router();

// POST route to upload an image
router.post("/upload", (req: express.Request, res: express.Response) => {
  upload(req, res, (err: any) => {
    if (err instanceof Error) {
      // If the error is an instance of Error, return the message
      return res.status(400).json({ error: err.message });
    }

    // If the upload is successful, send the image info in response
    if (req.file) {
      return res.status(200).json({
        message: "Image uploaded successfully",
        image: req.file.filename, // You can send the file name or the URL of the uploaded file here
      });
    } else {
      return res.status(400).json({ error: "No file uploaded" });
    }
  });
});

// Get albums from immich
const getAlbumsFromImmich = async () => {
  try {
    const response = await axios.get(`${process.env.IMMICH_API_URL}/albums`, {
      headers: {
        "x-api-key": `${process.env.IMMICH_API_KEY}`,
      },
    });
    return response.data; // Return the list of albums
  } catch (error) {
    console.error("Error fetching albums from Immich:", error);
    throw error;
  }
};

router.get("/albums", async (req: express.Request, res: express.Response) => {
  try {
    console.log("get /albums called.");
    const albums = await getAlbumsFromImmich();
    console.log("albums:", JSON.stringify(albums, null, 2));
    res.json(albums);
    // res.json(albums); // Respond with the list of albums
  } catch (error) {
    res.status(500).json({ error: "Error fetching albums from Immich" });
  }
});

// Get images for a blog post
router.get(
  "/:postId/images",
  async (req: express.Request, res: express.Response) => {
    try {
      const { postId } = req.params;

      // Fetch the images associated with the blog post from Immich
      const response = await axios.get(
        `${process.env.IMMICH_API_URL}/api/v1/posts/${postId}/images`,
        {
          headers: {
            Authorization: `Bearer ${process.env.IMMICH_API_KEY}`,
          },
        }
      );

      res.json(response.data);
    } catch (error) {
      console.error("Error fetching images from Immich:", error);
      res.status(500).json({ error: "Error fetching images from Immich" });
    }
  }
);

export default router;
