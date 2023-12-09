
var options = {
    method: 'GET',      
    headers: {},
    cache: "no-store"
};


var loadTemplate = (template) => {
        
    fetch('/templates/' + template + '.input.txt', options)
    .then(response => response.text())
    .then(body => {
      document.getElementById('input').value = body;
    });
    
    fetch('/templates/' + template + '.config.txt', options)
    .then(response => response.text())
    .then(body => {
      document.getElementById('config').value = body;
    });

    document.getElementById('load-modal').classList.add('d-none');
};

(() => {



    document.getElementById('load').addEventListener('click', (ev) => {
        document.getElementById('load-modal').classList.remove('d-none');
    });

    document.getElementById('generate').addEventListener('click', (ev) => {
        console.log("test");
        let input = document.getElementById('input').value;
        let config = document.getElementById('config').value;

        nunjucks.configure({ autoescape: true });
        document.getElementById('output').value = nunjucks.renderString(input, jsyaml.load(config));
    });

    fetch('/templates.json', options)
        .then(response => response.json())
        .then(body => {
            let list = document.getElementById('template-list');

            Object.keys(body).forEach((key) => {
                list.innerHTML += '<li class="list-group-item" onclick="loadTemplate(\'' + key + '\')">' + body[key] + '</li>';
            });
    });

})();