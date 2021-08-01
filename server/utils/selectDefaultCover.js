function selectDefaultCover(selected) {
    console.log(selected)
    const url = [
        'https://res.cloudinary.com/dgizzny4y/image/upload/v1627311777/S-E-a-N/default/cover_img/cover_1_woz6x4.jpg',
        'https://res.cloudinary.com/dgizzny4y/image/upload/v1627311777/S-E-a-N/default/cover_img/cover_2_asy8rz.jpg',
        'https://res.cloudinary.com/dgizzny4y/image/upload/v1627311776/S-E-a-N/default/cover_img/cover_3_o1odod.jpg',
        'https://res.cloudinary.com/dgizzny4y/image/upload/v1627311777/S-E-a-N/default/cover_img/cover_4_rfrtux.jpg',
        'https://res.cloudinary.com/dgizzny4y/image/upload/v1627311778/S-E-a-N/default/cover_img/cover_5_oebcbe.jpg',
        'https://res.cloudinary.com/dgizzny4y/image/upload/v1627311777/S-E-a-N/default/cover_img/cover_6_rubhbx.jpg'
    ]
    const filename = [
        'cover_1_woz6x4',
        'cover_2_asy8rz',
        'cover_3_o1odod',
        'cover_4_rfrtux',
        'cover_5_oebcbe',
        'cover_6_rubhbx'
    ]
    const selectedImage = {
        url: url[selected-1],
        filename: filename[selected-1]
    }

    return selectedImage
}

module.exports = {
    selectDefaultCover
}

