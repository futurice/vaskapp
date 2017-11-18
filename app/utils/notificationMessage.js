import ActionTypes from '../constants/ActionTypes';

const getMessage = (payload) => {
  switch (payload.type) {
    case ActionTypes.IMAGE: {
      return 'Great shot!';
    }
    case ActionTypes.SIMA: {
      return 'One sima down!';
    }
    case ActionTypes.TEXT: {
      return 'That\'s cool!';
    }
    case ActionTypes.CHECK_IN_EVENT: {
      return '*Check* Vask hard!';
    }
    case ActionTypes.MOOD: {
      return 'Vibe added!';
    }
  }
};

const getErrorMessage = (payload) => {
  return 'Oh no, an error occurred! 😓';
};

const getRateLimitMessage = (payload) => {
  return 'Hold your horses! 🐎'
};

const getInvalidEventMessage = (payload) => {
  return 'Oh no, an error occurred! 😓!'
};

export {
  getMessage,
  getErrorMessage,
  getRateLimitMessage,
  getInvalidEventMessage
};
