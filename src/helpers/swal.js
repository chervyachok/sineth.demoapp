import Swal from 'sweetalert2'

const $swal = Swal.mixin({
    buttonsStyling: false,
    position: 'top',
    showConfirmButton: false,
    customClass: {
        confirmButton: 'btn btn-outline-primary px-4 mx-2 mb-2',
        denyButton: 'btn btn-outline-primary px-4 mx-2 mb-2',
        cancelButton: 'btn btn-outline-primary px-4 mx-2 mb-2',
        footer: '_swal2_footer',
        icon: '_swal_icon',
        title:  '_swal_title',
        htmlContainer: '_swal_html_container',
        closeButton: '_swal_close_button',
    },
    showCloseButton: true,  
})

export default $swal 