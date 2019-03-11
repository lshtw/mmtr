export function phrasesRU() {
    return {
        header: 'Список email-адресов',
        email: 'Эл.почта',
        addDate: 'Дата добавления',
        remove: 'удалить',
        add: function (email) {
            return `email ${email} добавлен`
        },
        delete: function (email) {
            return `email ${email} удален`
        },
        emptyEmails: 'Нет email-адресов',
        listOfDates: 'Список дат',
        deleteDate: function (date) {
            return `дата ${date} удалена`
        }
    }
}