function isDefaultCover(img) {
    const filename = [
        'cover_1_woz6x4',
        'cover_2_asy8rz',
        'cover_3_o1odod',
        'cover_4_rfrtux',
        'cover_5_oebcbe',
        'cover_6_rubhbx'
    ]
    return filename.includes(img)
}

module.exports = {
    isDefaultCover
}
