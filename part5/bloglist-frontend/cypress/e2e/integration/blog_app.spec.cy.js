describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const newUser ={
      name: 'user1',
      username: 'user1',
      password: 'user1'
    }
    cy.request('POST', 'http://localhost:3003/api/users',newUser)


    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('input:first').type('user1')
      cy.get('input:last').type('user1')
      cy.contains('login').click()
      cy.contains('blogs')
    })

    it('fails with wrong credentials', function() {
      cy.get('input:first').type('user1')
      cy.get('input:last').type('wrong')
      cy.contains('login').click()
      cy.get('.notif')
        .should('contain', 'Wrong username or password')
        .and('have.css','color', 'rgb(255, 0, 0)')

      cy.get('html').should('not.contain', 'user1 logged in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'user1', password: 'user1' })
    })

    it('A blog can be created', function() {
      cy.contains('new note').click()
      cy.contains('create')
      cy.get('input[name = "title"]').type('example title')
      cy.get('input[name = "author"]').type('example author')
      cy.get('input[name = "url"]').type('www.example.com')

      cy.get('button').contains('create').click()

      cy.get('.notif')
        .should('contain', 'a new blog example title by example author')
        .and('have.css','color', 'rgb(0, 128, 0)')
      cy.contains('example title example author')

    })

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'example title',
          author:'example author',
          url: 'www.example.com'
        })
        cy.createBlog({
          title: 'example title2',
          author:'example author2',
          url: 'www.example2.com'
        })
      })

      it('Like  a blog', function() {
        cy.contains('example title example author').parent().find('button').contains('show').click()
        cy.contains('likes 0')
        cy.contains('example title example author').parent().find('button').contains('like').click()
        cy.contains('likes 1')
      })

      it('delete  a blog', function() {
        cy.contains('example title example author').parent().find('button').contains('show').click()
        cy.contains('example title example author').parent().find('button').contains('remove').click()

        cy.get('.notif')
          .should('contain', 'the blog has been successfully removed')
          .and('have.css','color', 'rgb(0, 128, 0)')

        cy.get('html').should('not.contain', 'example title example author')
      })


    })

    describe('and multiple blogs are created and the log in from a different account', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'example title',
          author:'example author',
          url: 'www.example.com'
        })
        cy.createBlog({
          title: 'example title2',
          author:'example author2',
          url: 'www.example2.com'
        })

        const newUser2 ={
          name: 'user2',
          username: 'user2',
          password: 'user2'
        }
        cy.request('POST', 'http://localhost:3003/api/users',newUser2)
        cy.login({ username: 'user2', password: 'user2' })
      })



      it('Delete a blog from another user', function() {
        cy.contains('example title example author').parent().find('button').contains('show').click()
        cy.contains('example title example author').parent().find('button').contains('remove').click()

        cy.get('.notif')
          .should('contain', 'only the creator can delete a blog')
          .and('have.css','color', 'rgb(255, 0, 0)')

        cy.get('html').should('contain', 'example title example author')


      })
    })

    describe('and multiple blogs exists', function () {
      beforeEach(function() {
        cy.createBlog({
          title: 'example title1',
          author:'example author1',
          url: 'www.example1.com'
        })
        cy.createBlog({
          title: 'example title2',
          author:'example author2',
          url: 'www.example2.com'
        })
        cy.createBlog({
          title: 'example title3',
          author:'example author3',
          url: 'www.example3.com'
        })
      })

      it('Blog are order by likes', function() {
        cy.contains('blogs')
        cy.get('.blog').then( blogs => {
          console.log('number of blogs', blogs.length)
          cy.wrap(blogs[0]).should('contain', 'example title1')
          cy.wrap(blogs[1]).should('contain', 'example title2')
          cy.wrap(blogs[2]).should('contain', 'example title3')

        })
        cy.contains('example title2 example author2').parent().find('button').contains('show').click()
        cy.contains('example title2 example author2').parent().find('button').contains('like')
          .click().wait(500)
          .click().wait(500)
          .click().wait(500)


        cy.get('.blog').then( blogs => {
          console.log('number of blogs', blogs.length)
          cy.wrap(blogs[0]).should('contain', 'example title2')
          cy.wrap(blogs[1]).should('contain', 'example title1')
          cy.wrap(blogs[2]).should('contain', 'example title3')

        })
      })



    })




  })

})