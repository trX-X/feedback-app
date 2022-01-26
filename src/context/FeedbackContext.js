import { createContext, useState, useEffect } from 'react';

// There are four steps to using React context:

// - Create context using the createContext method.
// - Take your created context and wrap the context provider around your component tree.
// - Put any value you like on your context provider using the value prop.
// - Read that value within any component by using the context consumer.

const FeedbackContext = createContext();

export const FeedbackProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState([]);

  //For the Edit button
  const [feedbackEdit, setFeedbackEdit] = useState({
    item: {},
    edit: false,
  });

  //We only want to run it once, because we have to get the data from the API only once
  useEffect(() => {
    fetchFeedback();
  }, []);

  //Fetch feedback from our json-server
  const fetchFeedback = async () => {
    const response = await fetch('/feedback?_sort=id&_order=desc');
    const data = await response.json();
    setFeedback(data);
    setIsLoading(false);
  };

  //Function for editing the feedback
  const editFeedback = (item) => {
    setFeedbackEdit({
      item,
      edit: true,
    });
  };

  //Replacing the delete feedback function and moving it to context
  const deleteFeedback = async (id) => {
    if (window.confirm('Are you sure you want to delete?')) {
      //Deleting from the backend
      await fetch(`/feedback/${id}`, { method: 'DELETE' });

      setFeedback(feedback.filter((item) => item.id !== id));
    }
  };

  //Replacing addFeedback from App.js to context
  const addFeedback = async (newFeedback) => {
    //Adding feedback to the backend
    const response = await fetch('/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newFeedback),
    });

    const data = await response.json();
    setFeedback([data, ...feedback]);
  };

  //Update feedback item
  const updateFeedback = async (id, updItem) => {
    //Updating it in the backend
    const response = await fetch(`/feedback/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updItem),
    });

    const data = await response.json()

    setFeedback(
      feedback.map((item) => (item.id === id ? { ...item, ...data } : item))
    );
  };

  return (
    <FeedbackContext.Provider
      value={{
        //States
        feedback: feedback,
        feedbackEdit,
        isLoading,
        //Functions
        deleteFeedback,
        addFeedback,
        editFeedback,
        updateFeedback,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};

export default FeedbackContext;
