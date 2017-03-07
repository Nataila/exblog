import mongoose from 'mongoose';
import db from './db';
import config from '../config';

mongoose.connect(config.MONGODB_URI);

// 用户表
const UserSchema = new mongoose.Schema({
  username: {type: String, unique: true, require: true},
  password: {type: String, require: true},
  email: {type: String, unique: true, require: true},
  created_at: {type: Date, default: Date.now},
});

UserSchema.statics.findByName = function(name, cb) {
  return new Promise((resolve, reject) => {
    this.findOne({'username': name}, (err, user) => {
      if (err) {
        reject(new Error('mongodb error'));
      }
      resolve(user);
    });
  });
};

// 标签
const TagsSchema = new mongoose.Schema({
  name: {type: String, required: true, unique: true},
  created_at: {type: Date, default: Date.now}
});

// 文章表
const PostSchema = new mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  tags: [{type: mongoose.Schema.Types.ObjectId, ref: 'Tags'}],
  created_at: {type: Date, default: Date.now}
});


const UserModel = mongoose.model('User', UserSchema);
const TagsModel = mongoose.model('Tags', TagsSchema);
const PostModel = mongoose.model('Post', PostSchema);

module.exports = {
  UserModel,
  TagsModel,
  PostModel,
};
