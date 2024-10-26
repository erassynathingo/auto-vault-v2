import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { motion } from 'framer-motion';
import { MessageSquare, ThumbsUp } from 'lucide-react';
import { db } from '../db';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

interface FeedbackItem {
  id?: number;
  userId: number;
  message: string;
  createdAt: Date;
  status: 'pending' | 'approved' | 'rejected';
}

const Feedback = () => {
  const { currentUser } = useAuth();
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const feedbackItems = useLiveQuery(
    () => db.feedback.orderBy('createdAt').reverse().toArray()
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setIsSubmitting(true);
    try {
      await db.feedback.add({
        userId: currentUser.id!,
        message,
        createdAt: new Date(),
        status: 'pending'
      });
      setMessage('');
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Feedback</h1>
          <p className="mt-2 text-gray-600">
            Help us improve Auto-Vault by sharing your thoughts and suggestions
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Your Feedback
              </label>
              <textarea
                id="message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="Share your thoughts, suggestions, or report issues..."
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </form>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Feedback</h2>
          {feedbackItems?.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <ThumbsUp className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No feedback yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Be the first to share your thoughts!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {feedbackItems?.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white p-6 rounded-lg shadow-sm"
                >
                  <p className="text-gray-900">{item.message}</p>
                  <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    <span className={`capitalize ${
                      item.status === 'approved' ? 'text-green-600' :
                      item.status === 'rejected' ? 'text-red-600' :
                      'text-yellow-600'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Feedback;