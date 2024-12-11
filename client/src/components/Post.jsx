import React from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';

const Post = ({ post }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="body1">{post.content}</Typography>
      </CardContent>
      {post.image && (
        <CardMedia
          component="img"
          alt="Post Image"
          height="140"
          image={post.image}
        />
      )}
    </Card>
  );
};

export default Post;
