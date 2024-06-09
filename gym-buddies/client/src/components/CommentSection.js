import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import '../styles/CommentSection.css';

const CommentSection = ({ workoutId }) => {
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`/api/comments/workout/${workoutId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments', error);
      }
    };

    fetchComments();
  }, [workoutId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        '/api/comments',
        { content, workout: workoutId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments([...comments, data]);
      setContent('');
    } catch (error) {
      console.error('Error adding comment', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComments(comments.filter((comment) => comment._id !== commentId));
    } catch (error) {
      console.error('Error deleting comment', error);
    }
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment);
    setEditContent(comment.content);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/api/comments/${editingComment._id}`,
        { content: editContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments(comments.map((comment) => (comment._id === editingComment._id ? { ...comment, content: editContent, edited: true } : comment)));
      setEditingComment(null);
      setEditContent('');
    } catch (error) {
      console.error('Error editing comment', error);
    }
  };

  return (
    <div className="comments">
      <h3>Comments</h3>
      {comments.map((comment) => (
        <div key={comment._id} className="comment">
          <p>
            <strong>{comment.user.username}</strong>: {comment.content} {comment.edited && <em>(edited)</em>}
          </p>
          {user && user.username === comment.user.username && (
            <div>
              <button onClick={() => handleEditComment(comment)}>Edit</button>
              <button onClick={() => handleDeleteComment(comment._id)}>Delete</button>
            </div>
          )}
        </div>
      ))}
      {editingComment ? (
        <form onSubmit={handleSaveEdit}>
          <label>
            Edit Comment:
            <input type="text" value={editContent} onChange={(e) => setEditContent(e.target.value)} />
          </label>
          <button type="submit">Save</button>
          <button type="button" onClick={() => setEditingComment(null)}>Cancel</button>
        </form>
      ) : (
        <form onSubmit={handleAddComment}>
          <label>
            Add Comment:
            <input type="text" value={content} onChange={(e) => setContent(e.target.value)} />
          </label>
          <button type="submit" className="button">Submit</button>
        </form>
      )}
    </div>
  );
};

export default CommentSection;
