var app = angular.module('lunchSociety');

app.service(
    "modalService",
    function(_) {
        // Return public API.

        var modals = []; // array of modals on the page

        var service = {};

        service.addModal = addModal;
        service.removeModal = removeModal;
        service.openModal = openModal;
        service.closeModal = closeModal;

        return service;

        function addModal(modal) {
            // add modal to array of active modals
            modals.push(modal);
        }

        function removeModal(id) {
            // remove modal from array of active modals
            var modalToRemove = _.findWhere(modals, { id: id });
            modals = _.without(modals, modalToRemove);
        }

        function openModal(id) {
            // open modal specified by id
            var modal = _.findWhere(modals, { id: id });
            modal.open();
        }

        function closeModal(id) {
            // close modal specified by id
            var modal = _.findWhere(modals, { id: id });
            modal.close();
        }
    }
);
