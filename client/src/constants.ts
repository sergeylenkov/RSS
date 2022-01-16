const prod = {
  urls: {
    api: 'http://localhost:9000/',
  },
};

const dev = {
  urls: {
    api: 'http://localhost:9000/',
  },
};

export const config = process.env.NODE_ENV === 'development' ? dev : prod;
