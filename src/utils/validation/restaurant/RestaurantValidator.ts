export const restaurantNameValidation = (name: string) => {

    if (name.trim() === '') {
        return `Restaurant name is required`;
    }

    return null;
};

export const restaurantStreetValidation = (street: string) => {
    if (
        /^[A-Z][a-z0-9/ ]+$/.test(
            street,
        )
    ) {
        return null;
    }
    if (street.trim() === '') {
        return 'Street is required';
    }

    return 'Please enter a valid street';
};

export const restaurantCityCountryValidation = (city: string, isCity: boolean) => {
    const toDisplay = isCity ? 'City' : 'Country';

    if (
        /^[A-Z][a-z]+( [A-Z][a-z]+)*$/.test(
            city,
        )
    ) {
        return null;
    }
    if (city.trim() === '') {
        return `${toDisplay} is required`;
    }
    return `Please enter a valid ${toDisplay}.`;
};

export const restaurantZipCodeValidation = (zipCode: string) => {
    if (
        /^(?:\d{5}(?:[-]\d{4})?|\d{2}[-]\d{3})$/.test(
            zipCode,
        )
    ) {
        return null;
    }
    if (zipCode.trim() === '') {
        return 'Zip code is required';
    }

    return 'Please enter a valid zip code';
};

export const restaurantPhoneNumberValidation = (zipCode: string) => {
    if (
        /^\d{9}$/.test(
            zipCode,
        )
    ) {
        return null;
    }
    if (zipCode.trim() === '') {
        return 'Phone number is required';
    }

    return 'Please enter a valid phone number';
};

export const restaurantTagsValidation = (tags: string) => {
    if ( /^([a-z]+[,]?)*(?<![,])$/.test(tags) ) {
        return null;
    }
    return 'Please enter valid tags';
}
