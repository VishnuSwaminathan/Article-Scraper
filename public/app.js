$.getJSON('/scrape', function(data) {
  for (var i = 0; i < data.length; i++) {
    var oldLink = '';
    oldLink = data[i].link;
    var subLink = 'https://www.ctvnews.ca/';
    var newLink = '';
    if (oldLink.includes(subLink)) {
      newLink = oldLink;
    } else {
      newLink = subLink + oldLink;
    }

    $('#articles').append(
      "<div class='card' id='scrapedCards' data-id='" +
        data[i]._id +
        "'>" +
        "<div class='card-body'>" +
        " <div class='card-title' data-id='" +
        data[i]._id +
        "'>" +
        "<p data-id='" +
        data[i]._id +
        "'>" +
        data[i].title +
        '</p>' +
        "<div class='card-text' data-id='" +
        data[i]._id +
        "'>" +
        "<a class='btn btn-primary'  target='_blank' href='" +
        newLink +
        "'>LINK</a>" +
        //
        "<a class='btn btn-primary' id='saveBtn' href='/saveArticles/" +
        data[i]._id +
        "' data-id='" +
        data[i]._id +
        "'> SAVE </a>" +
        "<a class='btn btn-secondary' data-id='" +
        data[i]._id +
        "'>COMMENT</a>" +
        //
        '</div>' +
        '</div>' +
        '</div>' +
        '<div>' +
        '<br>' +
        '<br>'
    );
  }
  console.log('app getJson for /scrape');
});

$(document).on('click', '#saveBtn', function(e) {
  console.log('listening');
  alert('Saved!');
  $.ajax({
    method: 'POST',
    url: $(this).attr('href'),
    data: $(this).attr('data-id'),
    success: function(data) {
      $(this)
        .closest('.card')
        .empty();
    }
  });
  e.preventDefault();
});

$(document).on('click', '#saved', function(e) {
  console.log('listening');

  $.ajax({
    method: 'GET',
    url: '/getSavedArticles',
    success: function(data) {
      console.log(data.length + ': DATA LENGTH for SAVED');
      $('#articles').empty();

      for (var i = 0; i < data.length; i++) {
        $('#articles').prepend(
          "<div class='card' id='savedCards' data-id='" +
            data[i]._id +
            "'>" +
            "<div class='card-body'>" +
            " <div class='card-title' data-id='" +
            data[i]._id +
            "'>" +
            "<p data-id='" +
            data[i]._id +
            "'>" +
            data[i].title +
            '</p>' +
            "<div class='card-text' data-id='" +
            data[i]._id +
            "'>" +
            "<a class='btn btn-primary'  target='_blank' href='" +
            data[i].link +
            "'>LINK</a>" +
            "<a class='btn btn-secondary' data-id='" +
            data[i]._id +
            "'>COMMENT</a>" +
            //
            '</div>' +
            '</div>' +
            '</div>' +
            '<div>' +
            '<br>' +
            '<br>'
        );
      }
      console.log('app getJson for /getSavedArticles');
    }
  });
  e.preventDefault();
});

$(document).on('click', '.btn-secondary', function() {
  $('#notes').empty();
  var thisId = $(this).attr('data-id');

  $.ajax({
    method: 'GET',
    url: '/articles/' + thisId
  }).then(function(data) {
    console.log(data);
    // The title of the article
    $('#notes').append('<h2>' + data.title + '</h2>');
    // An input to enter a new title
    $('#notes').append("<input id='titleinput' name='title' >");
    // A textarea to add a new note body
    $('#notes').append("<textarea id='bodyinput' name='body'></textarea>");
    // A button to submit a new note, with the id of the article saved to it
    $('#notes').append(
      "<button data-id='" + data._id + "' id='savenote'>Save Note</button>"
    );
    if (data.note) {
      $('#titleinput').val(data.note.title);
      $('#bodyinput').val(data.note.body);
    }
  });
});

$(document).on('click', '#savenote', function() {
  var thisId = $(this).attr('data-id');

  $.ajax({
    method: 'POST',
    url: '/articles/' + thisId,
    data: {
      title: $('#titleinput').val(),
      body: $('#bodyinput').val()
    }
  }).then(function(data) {
    console.log(data);
    $('#notes').empty();
  });

  $('#titleinput').val('');
  $('#bodyinput').val('');
});
