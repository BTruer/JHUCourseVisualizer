$(function() {
    var getDepartments = function() {
        var selectedSchool = encodeURIComponent($('#schools option:selected').val());
        $.getJSON('/' + selectedSchool + '/departments', function(data) {
            if ($('#departments').length == 0) {
                $('<select id="departments"></select>').insertBefore('#submit').append('<option>Select a department</option>');;
            } else {
                $('#departments option').remove().append('<option>Select a department</option>');
            }

            for (var i = 0; i < data.length; i++) {
                $('#departments').append('<option>' + data[i] + '</option>');
            }
        });
    };

    var getClasses = function(school, department) {
        $.getJSON('/' + encodeURIComponent(school) + '/' + encodeURIComponent(department) + '/classes', function(data) {
            console.log(data);
        });
    };

    $.getJSON('/schools', function(data) {
        $('<select id="schools"></select>').insertBefore('#submit').append('<option>Select a school</option>');
        for (var i = 0; i < data.length; i++) {
            $('#schools').append('<option>' + data[i] + '</option>');
        }
    });

    $('#submit').on('click', function(e) {
        e.preventDefault();
        $('.user-input').hide();
        getClasses($('#schools').val(), $('#departments').val());
    });

    $(document).on('change', '#schools', function() {
        getDepartments();
    });
});
