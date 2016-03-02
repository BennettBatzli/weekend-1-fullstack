var totalSalary = 0;
var monthlySalaryCost = 0;
$(document).ready(function() {

  $('#submit-button').on('click', postData);

  getData();

  $('.person-container').on('click', '.delete-employee', deleteEmployee);
});

function postData() {
  event.preventDefault();

  var values = {};
  $.each($('#employee_form').serializeArray(), function(i, field) {
    values[field.name] = field.value;
  });

  console.log(values);

  $.ajax({
    type: 'POST',
    url: '/employeeRoute',
    data: values,
    success: function(data) {
      if(data) {
        // everything went ok
        console.log('from server:', data);
        getData();
      } else {
        console.log('error');
      }
    }
  });

}

function getData() {
  $.ajax({
    type: 'GET',
    url: '/employeeRoute',
    success: function(data) {
      totalSalary = 0;

      $('.person-container').empty();
      for(var i=0; i<data.length; i++) {
        $('.person-container').append('<div class="employee-box"></div>');
        var $el = $('.person-container').children().last();

        $el.append('<span><strong>ID: </strong>' + data[i].id + ' </span><br>' +
          '<span><strong>Name: </strong>' + data[i].first_name + '' + data[i].last_name + ' </span><br>' +
          '<span><strong>Job Title: </strong>' + data[i].job_title + ' </span><br>' +
          '<span><strong>Salary: </strong>' + data[i].salary + ' </span>' +
          '<button class="delete-employee" data-id="' + data[i].id + '">delete employee</button>');

        totalSalary += parseFloat(data[i].salary);


        console.log('employee ID::::', data[i].id);
      }
      monthlySalaryCost = (totalSalary / 12);
      $('#total-salaries').text(totalSalary);
      $('#monthly-salary-cost').text(monthlySalaryCost);
    }
  });
}

function deleteEmployee() {
  var deleteID = {};
  deleteID.id = $(this).data('id');
  $(this).parent().remove();

  console.log('here is the delete ID::', deleteID);

  $.ajax({
    type: 'DELETE',
    url: 'employeeRoute',
    data: deleteID,
    success: function(data){
      getData();
    }
  });

}



