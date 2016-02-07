var request = require('request');
var sleep = require('sleep');
var _ = require('underscore');
var key = 'AD6Suus1io7Gwe2PGuM3Do52hf7l87m2';
var term = 'Spring 2016'

module.exports = {
	schools: function(cb) {
		var url = 'https://isis.jhu.edu/api/classes/codes/schools?key=' + key + '&Term=' + encodeURI(term);

		request(url, function(err, data) {
			if (err) console.log(err);

			var data = JSON.parse(data.body);
			var result = [];

			for (var i = 0; i < data.length; i++) {
				result.push(data[i].Name);
			};

			cb(result);
		});
	},

	departments: function(school, cb) {
		var url = 'https://isis.jhu.edu/api/classes/codes/departments/' + encodeURI(school) + '?key=' + key + '&Term=' + encodeURI(term);

		request(url, function(err, data) {
			if(err) console.log(err);

			var data = JSON.parse(data.body);
			var result = [];

			for (var i = 0; i < data.length; i++) {
				result.push(data[i].DepartmentName);
			};

			cb(result);
		});
	},

    addPrerequisite: function(arr, i, url) {
        request(url, function(err, data) {
            if(err) console.log(err);

            var data = JSON.parse(data.body);

            if (data[0].SectionDetails[0].Prerequisites.length !== 0) {
                arr[i].prerequisites = data[0].SectionDetails[0].Prerequisites[0].Description;
                console.log(data[0].SectionDetails[0].Prerequisites[0].Description);
                console.log();
                console.log();
            }

            return arr;
        });
    },

    prerequisites: function(arr) {
        for (var i = 5; i < 12; i++) {
            var url = 'https://isis.jhu.edu/api/classes/?key=' + key + '&Term=' + encodeURI(term) + '&CourseNumber=' + encodeURI(arr[i].schoolCode.concat(arr[i].departmentCode, arr[i].classCode, arr[i].sectionCode));

            arr = this.addPrerequisite(arr, i, url);

            sleep.sleep(1);
        }

        return arr;
    },

	classes: function(school, department, cb) {
        var $this = this;

		request({
            url: 'https://isis.jhu.edu/api/classes/',
            qs: {
                key: key,
                Term: term,
                School: school,
                Department: department
            }
        }, function(err, data) {
			if(err) console.log(err);

			var data = JSON.parse(data.body);
            var arr = [];
            var codes = [];
            for (var i = 0; i < data.length; i++) {
                codes = data[i].OfferingName.split('.');
                arr.push({
                    "schoolName": data[i].SchoolName,
                    "schoolCode": codes[0],
                    "departmentName": data[i].Department,
                    "departmentCode": codes[1],
                    "className": data[i].Title,
                    "classCode": codes[2],
                    "sectionCode": data[i].SectionName,
                    "openSeats": data[i].OpenSeats
                });
            }

            cb($this.prerequisites(arr));
		});
	}
}
