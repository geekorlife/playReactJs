const idSz = ['Divers', '0-3M', '3M', '3-6M', '6M', '6-12M', '12M', '12-18M', '18M', '18-24M', '2T', '3T', '4T', '5T', '6T', '7', '8', '9', '10', '11', '12', '14', '16', '18', '20'];

const whoShoes = ['Infant (0-9M)', 'Toddler (9M-4Y)', 'Little kid (5-7Y)', 'Big kid (7-12Y)', 'Men', 'Women'];

const sizeShoes = {
    '0': ['0', '1', '1.5', '2', '2.5', '3'], // infant
    '1': ['3.5', '4', '4.5', '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10'], // toddler
    '2': ['10.5', '11', '11.5', '12', '12.5', '13', '13.5', '1', '1.5', '2', '2.5', '3'], // Little kid
    '3': ['3.5', '4', '4.5', '5', '5.5', '6', '6.5', '7', '7.5'], // Big kid
    '4': ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '13', '14', '15', '16'], // Men
    '5': ['4', '4.5', '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12']  // Women
};

export default {
    idSz: idSz,
    whoShoes: whoShoes,
    sizeShoes: sizeShoes
}