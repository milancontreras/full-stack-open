//const { identity } = require('lodash');
const _ = require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  const likes = blogs
    .map(blog => {
      //console.log(blog.likes)
      return blog.likes
    })
    .reduce( (previousValue, currentValue) => {
      return previousValue + currentValue
    },0)

  return likes
}

const favoriteBlog = (blogs) => {
  if(blogs.length === 0){
    return {}
  }
  const mosliked = blogs.reduce((result, blog) => (
    result.likes >= blog.likes ? result : blog
  ),blogs[0])

  const returnedBlog = {
    title: mosliked.title,
    author : mosliked.author,
    likes : mosliked.likes
  }


  return returnedBlog

}

const mostBlogs = (blogs) => {
  if((typeof blogs)!== 'object'){
    return {}
  }else if(blogs.length ===0){
    return {}
  }
  const authors1 = blogs.reduce((result, blog) => {
    if (!(result.includes(blog.author))){
      return [...result, blog.author]
    }else{
      return [...result]
    }
  },[])


  let  maxBlogs = -1
  let authorWithMoreBlogs = ''
  authors1.forEach(author => {
    const listOfBlogsOfOneAuthor =  blogs.filter(blog => (blog.author === author))
    if(listOfBlogsOfOneAuthor.length > maxBlogs){
      maxBlogs = listOfBlogsOfOneAuthor.length
      authorWithMoreBlogs = author
    }
  })

  return ({
    author: authorWithMoreBlogs,
    blogs: maxBlogs
  })
}

const mostBlogs2 = (blogs) => {
  if((typeof blogs)!== 'object'){
    return {}
  }else if(blogs.length ===0){
    return {}
  }

  const authorsAndNumberOfBlogs = _.countBy(blogs,'author')


  const author = Object.keys(authorsAndNumberOfBlogs).reduce((actual, next ) => {
    return (authorsAndNumberOfBlogs[actual] >=  authorsAndNumberOfBlogs[next] ? actual : next)
  })



  return {
    author: author,
    blogs: authorsAndNumberOfBlogs[author]


  }

}

const mostLikes = (blogs) => {

  if((typeof blogs)!== 'object'){
    return {}
  }else if(blogs.length ===0){
    return {}
  }

  const blogsOfEachAuthor = _.groupBy(blogs, 'author')

  const authorWithTotalLikes = []
  for(const author in blogsOfEachAuthor){

    authorWithTotalLikes.push( {
      author: author,
      likes: _.sumBy(blogsOfEachAuthor[author], 'likes')
    })
  }

  const result = authorWithTotalLikes.reduce((actual,next) => {
    return actual.likes > next.likes ? actual : next
  })


  return result
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostBlogs2,
  mostLikes,
}