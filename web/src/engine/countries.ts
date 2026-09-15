export interface Country {
  code: string;
  nameRo: string;
  nameEn: string;
  flag: string; // Emoji flag
  firstNames: string[];
  lastNames: string[];
}

export const COUNTRIES: Record<string, Country> = {
  RO: {
    code: 'RO',
    nameRo: 'România',
    nameEn: 'Romania',
    flag: '🇷🇴',
    firstNames: ['Andrei', 'Mihai', 'Alexandru', 'Cristian', 'Florin', 'Denis', 'Bogdan', 'Radu', 'Ionuț', 'George', 'Laurențiu', 'Marian', 'Valentin', 'Răzvan', 'Romeo'],
    lastNames: ['Popa', 'Popescu', 'Ionescu', 'Radu', 'Dumitru', 'Stoica', 'Gheorghe', 'Stan', 'Munteanu', 'Bejan', 'Mitrea', 'Ciobotariu', 'Iacob', 'Marin', 'Mihăilă']
  },
  BE: {
    code: 'BE',
    nameRo: 'Belgia',
    nameEn: 'Belgium',
    flag: '🇧🇪',
    firstNames: ['Kevin', 'Eden', 'Romelu', 'Thibaut', 'Jan', 'Axel', 'Dries', 'Youri', 'Leandro', 'Timothy', 'Arthur', 'Charles', 'Jérémy'],
    lastNames: ['De Bruyne', 'Hazard', 'Lukaku', 'Courtois', 'Vertonghen', 'Witsel', 'Mertens', 'Tielemans', 'Trossard', 'Castagne', 'Theate', 'De Ketelaere', 'Doku']
  },
  CZ: {
    code: 'CZ',
    nameRo: 'Cehia',
    nameEn: 'Czech Republic',
    flag: '🇨🇿',
    firstNames: ['Tomáš', 'Petr', 'Pavel', 'Jan', 'Milan', 'Vladimír', 'Patrik', 'Jakub', 'Antonín', 'Ladislav', 'Marek', 'David'],
    lastNames: ['Souček', 'Schick', 'Nedvěd', 'Čech', 'Baroš', 'Coufal', 'Jankto', 'Hložek', 'Barák', 'Krejčí', 'Zima', 'Vaclík']
  },
  SK: {
    code: 'SK',
    nameRo: 'Slovacia',
    nameEn: 'Slovakia',
    flag: '🇸🇰',
    firstNames: ['Marek', 'Milan', 'Martin', 'Stanislav', 'Peter', 'Juraj', 'Ondrej', 'Róbert', 'Lukas', 'Patrik', 'David'],
    lastNames: ['Hamšík', 'Škriniar', 'Dúbravka', 'Lobotka', 'Pekarík', 'Kucka', 'Duda', 'Boženík', 'Haraslín', 'Hancko', 'Vavro']
  },
  DE: {
    code: 'DE',
    nameRo: 'Germania',
    nameEn: 'Germany',
    flag: '🇩🇪',
    firstNames: ['Thomas', 'Manuel', 'Joshua', 'Toni', 'Kai', 'Leroy', 'Florian', 'Jamal', 'Ilkay', 'Leon', 'Antonio', 'Mats'],
    lastNames: ['Müller', 'Neuer', 'Kimmich', 'Kroos', 'Havertz', 'Sané', 'Wirtz', 'Musiala', 'Gündogan', 'Goretzka', 'Rüdiger', 'Hummels']
  },
  GB: {
    code: 'GB',
    nameRo: 'Anglia',
    nameEn: 'England',
    flag: '🇬🇧',
    firstNames: ['Harry', 'Jude', 'Phil', 'Bukayo', 'Declan', 'Marcus', 'John', 'Kyle', 'Jordan', 'Trent', 'Cole', 'Jack'],
    lastNames: ['Kane', 'Bellingham', 'Foden', 'Saka', 'Rice', 'Rashford', 'Stones', 'Walker', 'Pickford', 'Alexander-Arnold', 'Palmer', 'Grealish']
  },
  ES: {
    code: 'ES',
    nameRo: 'Spania',
    nameEn: 'Spain',
    flag: '🇪🇸',
    firstNames: ['Rodri', 'Pedri', 'Gavi', 'Lamine', 'Ferran', 'Dani', 'Alvaro', 'Mikel', 'Nico', 'Robin', 'Unai', 'Aymeric'],
    lastNames: ['Hernández', 'González', 'Paez', 'Yamal', 'Torres', 'Carvajal', 'Morata', 'Merino', 'Williams', 'Le Normand', 'Simón', 'Laporte']
  },
  IT: {
    code: 'IT',
    nameRo: 'Italia',
    nameEn: 'Italy',
    flag: '🇮🇹',
    firstNames: ['Gianluigi', 'Nicolo', 'Federico', 'Alessandro', 'Lorenzo', 'Giacomo', 'Davide', 'Mateo', 'Gianluca', 'Bryan'],
    lastNames: ['Donnarumma', 'Barella', 'Chiesa', 'Bastoni', 'Pellegrini', 'Raspadori', 'Frattesi', 'Retegui', 'Mancini', 'Cristante']
  },
  FR: {
    code: 'FR',
    nameRo: 'Franța',
    nameEn: 'France',
    flag: '🇫🇷',
    firstNames: ['Kylian', 'Antoine', 'Aurélien', 'Eduardo', 'Ousmane', 'Theo', 'Dayot', 'William', 'Jules', 'Mike', 'Adrien'],
    lastNames: ['Mbappé', 'Griezmann', 'Tchouaméni', 'Camavinga', 'Dembélé', 'Hernández', 'Upamecano', 'Saliba', 'Koundé', 'Maignan', 'Rabiot']
  },
  NL: {
    code: 'NL',
    nameRo: 'Olanda',
    nameEn: 'Netherlands',
    flag: '🇳🇱',
    firstNames: ['Virgil', 'Frenkie', 'Memphis', 'Cody', 'Nathan', 'Denzel', 'Tijjani', 'Bart', 'Jeremie', 'Matthijs', 'Xavi'],
    lastNames: ['van Dijk', 'de Jong', 'Depay', 'Gakpo', 'Aké', 'Dumfries', 'Reijnders', 'Verbruggen', 'Frimpong', 'de Ligt', 'Simons']
  },
  PT: {
    code: 'PT',
    nameRo: 'Portugalia',
    nameEn: 'Portugal',
    flag: '🇵🇹',
    firstNames: ['Cristiano', 'Bruno', 'Bernardo', 'Rafael', 'Ruben', 'Diogo', 'Joao', 'Vitinha', 'Goncalo', 'Pepe', 'Nuno'],
    lastNames: ['Ronaldo', 'Fernandes', 'Silva', 'Leão', 'Dias', 'Jota', 'Cancelo', 'Ferreira', 'Ramos', 'Mendes', 'Palhinha']
  },
  PL: {
    code: 'PL',
    nameRo: 'Polonia',
    nameEn: 'Poland',
    flag: '🇵🇱',
    firstNames: ['Robert', 'Piotr', 'Wojciech', 'Jakub', 'Matty', 'Nicola', 'Karol', 'Jan', 'Przemysław', 'Krzysztof'],
    lastNames: ['Lewandowski', 'Zieliński', 'Szczęsny', 'Kiwior', 'Cash', 'Zalewski', 'Świderski', 'Bednarek', 'Frankowski', 'Piątek']
  },
  UA: {
    code: 'UA',
    nameRo: 'Ucraina',
    nameEn: 'Ukraine',
    flag: '🇺🇦',
    firstNames: ['Oleksandr', 'Mykhailo', 'Artem', 'Viktor', 'Andriy', 'Ilya', 'Vitaliy', 'Heorhiy', 'Roman', 'Taras'],
    lastNames: ['Zinchenko', 'Mudryk', 'Dovbyk', 'Tsygankov', 'Lunin', 'Zabarnyi', 'Mykolenko', 'Sudakov', 'Yaremchuk', 'Stepanenko']
  },
  BR: {
    code: 'BR',
    nameRo: 'Brazilia',
    nameEn: 'Brazil',
    flag: '🇧🇷',
    firstNames: ['Vinicius', 'Rodrygo', 'Neymar', 'Alisson', 'Casemiro', 'Gabriel', 'Marquinhos', 'Bruno', 'Lucas', 'Raphinha', 'Endrick'],
    lastNames: ['Junior', 'Goes', 'da Silva', 'Becker', 'Magalhães', 'Correa', 'Guimarães', 'Paquetá', 'Dias Belloli', 'Felipe']
  },
  AR: {
    code: 'AR',
    nameRo: 'Argentina',
    nameEn: 'Argentina',
    flag: '🇦🇷',
    firstNames: ['Lionel', 'Julian', 'Lautaro', 'Alexis', 'Rodrigo', 'Emiliano', 'Enzo', 'Cristian', 'Nahuel', 'Lisandro', 'Angel'],
    lastNames: ['Messi', 'Alvarez', 'Martínez', 'Mac Allister', 'De Paul', 'Fernández', 'Romero', 'Molina', 'Di María', 'Otamendi']
  },
  US: {
    code: 'US',
    nameRo: 'Statele Unite',
    nameEn: 'United States',
    flag: '🇺🇸',
    firstNames: ['Christian', 'Weston', 'Tyler', 'Timothy', 'Folarin', 'Sergiño', 'Matt', 'Antonee', 'Chris', 'Yunus', 'Gio'],
    lastNames: ['Pulisic', 'McKennie', 'Adams', 'Weah', 'Balogun', 'Dest', 'Turner', 'Robinson', 'Richards', 'Musah', 'Reyna']
  }
};

export const COUNTRIES_LIST: Country[] = Object.values(COUNTRIES);

/**
 * Generează un nume de jucător specific unei țări
 */
export function generatePlayerNameForCountry(countryCode: string): string {
  const country = COUNTRIES[countryCode] || COUNTRIES.RO;
  const firstName = country.firstNames[Math.floor(Math.random() * country.firstNames.length)];
  const lastName = country.lastNames[Math.floor(Math.random() * country.lastNames.length)];
  return `${firstName} ${lastName}`;
}

/**
 * Returnează steagul unei țări sau steagul implicit
 */
export function getCountryFlag(countryCode?: string): string {
  if (!countryCode) return '🇷🇴';
  return COUNTRIES[countryCode]?.flag || '🌐';
}
