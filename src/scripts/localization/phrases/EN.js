export function phrasesEN() {
    return {
        header: 'List of emails',
        emails: 'E-mails',
        addDate: 'Date added',
        remove: 'delete',
        add: function (email) {
            return `email ${email} added`;
        },
        delete: function (email) {
            return `email ${email} deleted`;
        },
        emptyEmails: 'no emails',
        listOfDates: 'List of dates',
        deleteDate: function (date) {
            return `date ${date} deleted`;
        }
    };
}