const prod = {
  urls: {
    api: 'http://localhost:8080/'
  }
}

const dev = {
  urls: {
    api: 'http://localhost:5000/'
  }
}

export const config = process.env.NODE_ENV === 'development' ? dev : prod;