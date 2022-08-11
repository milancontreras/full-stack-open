const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const likes = blogs
    .map(blog => {
      console.log(blog.likes)
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
  const mosliked = blogs.reduce((result, blog)=>(
    result.likes >= blog.likes ? result : blog
  ),blogs[0])
  return mosliked
  
}



module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}