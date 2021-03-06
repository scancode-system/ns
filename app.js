"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var application = require("tns-core-modules/application");
var application_1 = require("tns-core-modules/application");
var settings = require("tns-core-modules/application-settings");
application.on(application_1.launchEvent, function (args) {
});
application.on(application_1.resumeEvent, function (args) {
    //settings.setString('url', 'http://192.168.0.21/dashboardw');
    //settings.setString('api', settings.getString('url')+'/api');
    //settings.setString('username', 'http://192.168.0.100/api/');
});
function historicoItems(value) {
    if (value == 1) {
        return 'Aberto';
    }
    else if (value == 2) {
        return 'Concluído';
    }
    else if (value == 3) {
        return 'Cancelado';
    }
    else if (value == 4) {
        return 'Reservado';
    }
    else if (value == 6) {
        return 'Em andamento';
    }
    else {
        return 'N/A';
    }
}
function historicoBg(value) {
    if (value == 1 || value == 6) {
        return 'success';
    }
    else if (value == 2) {
        return 'primary';
    }
    else if (value == 3) {
        return 'danger';
    }
    else if (value == 4) {
        return 'info';
    }
}
function concurrency(value) {
    var val = (value / 1).toFixed(2).replace('.', ',');
    return 'R$' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
function getIcon(value) {
    return String.fromCharCode(value);
}
function urlBefore(value) {
    return settings.getString('url', '') + '/' + value;
}
application.setResources({ getIcon: getIcon, concurrency: concurrency, historicoItems: historicoItems, historicoBg: historicoBg, urlBefore: urlBefore });
// colcoar aqui condicao para ver qual frame vai ser carregado
var saller = settings.getString('saller');
if (saller) {
    application.run({ moduleName: "views/tab/frame-root" });
}
else {
    application.run({ moduleName: "views/login/frame-root" });
}
