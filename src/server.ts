import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import seedSuperAdmin from './app/DB';

let server: Server;

async function main() {
  try {
    await mongoose.connect(
      'mongodb+srv://edusync:WIo7u9TShcTespwN@cluster0.l4anbhy.mongodb.net/edusyncBD?retryWrites=true&w=majority&appName=Cluster0' as string,
    );

    seedSuperAdmin();
    server = app.listen(5001, () => {
      console.log(`app is listening on port ${5001}`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();

process.on('unhandledRejection', (err) => {
  console.log(`😈 unahandledRejection is detected , shutting down ...`, err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on('uncaughtException', () => {
  console.log(`😈 uncaughtException is detected , shutting down ...`);
  process.exit(1);
});
