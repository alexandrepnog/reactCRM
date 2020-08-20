import Swal from 'sweetalert2';

class Message {
  constructor() {
    this.toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: true,
      onOpen: toast => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      }
    });
  }

  async question(text, title = 'Questionar...') {
    const result = await Swal.fire({
      title: title,
      text: text,
      icon: 'question',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'Não, não senhor !',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Sim, confirmado!'
    });
    return result.value;
  }

  toastSuccess(text) {
    this.toast.fire({
      icon: 'success',
      title: text
    });
  }
  toastError(text) {
    this.toast.fire({
      icon: 'error',
      title: text
    });
  }
  toastWarning(text) {
    this.toast.fire({
      icon: 'warning',
      title: text
    });
  }
  toastInfo(text) {
    this.toast.fire({
      icon: 'info',
      title: text
    });
  }
}

export let message = new Message();
