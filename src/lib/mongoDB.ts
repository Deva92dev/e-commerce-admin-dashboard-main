import mongoose from 'mongoose';

export async function ConnectDB() {
  try {
    mongoose.connect(process.env.MONGO_URI!);
    const connection = mongoose.connection;

    connection.on('connected', () => {
      console.log('MongoDB connected');
    });

    connection.on('error', (err) => {
      console.log(
        'MongoDb Connection error. Please make sure MongoDb is running + err'
      );
      process.exit();
    });
  } catch (error) {
    console.log('Something goes wrong');
    console.log(error);
  }
}
