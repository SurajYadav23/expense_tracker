import Expense from '../models/Expense.js';
import { v4 as uuidv4 } from 'uuid';
import AWS from 'aws-sdk';

export const addExpense = async (req, res) => {
  const { amount, description, category } = req.body;
  req.user
    .createExpense({ amount, description, category })
    .then((expense) => {
      return res.status(201).json({ expense, success: true });
    })
    .catch((err) => {
      return res.status(403).json({ success: false, error: err });
    });
};

export const getAllExpenses = async (req, res) => {
  const userId = req.user.id;

  try {
    const expenses = await Expense.findAll({
      where: { userId },
    });

    res.status(200).json({
      success: true,
      expenses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve expenses',
    });
  }
};

export const getexpenses = (req, res) => {
  req.user
    .getExpenses()
    .then((expenses) => {
      return res.status(200).json({ expenses, success: true });
    })
    .catch((err) => {
      return res.status(402).json({ error: err, success: false });
    });
};

export const deleteexpense = (req, res) => {
  const expenseid = req.params.expenseid;
  Expense.destroy({ where: { id: expenseid } })
    .then(() => {
      return res
        .status(204)
        .json({ success: true, message: 'Deleted Successfuly' });
    })
    .catch((err) => {
      console.log(err);
      return res.status(403).json({ success: true, message: 'Failed' });
    });
};
export const downloadExpenses = async (req, res) => {
  try {
    if (!req.user.ispremiumuser) {
      return res
        .status(401)
        .json({ success: false, message: 'User is not a premium User' });
    }

    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });

    const bucket = 'my-expensetrack';
    const headBucketParams = {
      Bucket: bucket,
    };

    try {
      await s3.headBucket(headBucketParams).promise();
    } catch (err) {
      await s3.createBucket({ Bucket: bucket }).promise(); // Fix the typo here
      console.log('Bucket was created successfully.');
    }

    // Create a unique name for the object (file)
    const objectKey = 'expenses' + uuidv4() + '.txt';

    // Upload data to the S3 bucket as an object
    const data = JSON.stringify(await req.user.getExpenses());

    const uploadParams = {
      Bucket: bucket,
      Key: objectKey,
      Body: data,
    };

    await s3.upload(uploadParams).promise();
    console.log('Object was uploaded successfully.');

    const objectUrl = `https://${bucket}.s3.amazonaws.com/${objectKey}`;

    res.status(201).json({ fileUrl: objectUrl, success: true });
  } catch (err) {
    res
      .status(500)
      .json({
        error: err,
        success: false,
        message: 'Something went wrong',
      });
  }
};


