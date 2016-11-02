var getColor = function(status) {

	var color = '';

	switch(status) {
        case 'accepted':
            color = '#629200';
            break;
        case 'delivered':
            color = '#e6e600';
            break;
        case 'finished':
            color = '#f39300';
            break;
        case 'started': 
            color = '#203e64';
            break;
        case 'rejected':
            color = '#a71f39';
            break;
        default:
            color = '#e0e2e5';
    }

    return color;
}

exports.getColor = getColor;