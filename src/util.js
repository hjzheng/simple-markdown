import Swal from 'sweetalert2';

export const popupConfirm = (message) => {
    return Swal.fire({
      title: '?',
      text: message,
      type: 'info',
      confirmButtonText: 'OK',
      showCancelButton: true,
      showCloseButton: true
    })
}

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();

    // 刚刚(15分钟之内), 15分钟之前, 30分钟之前 1小时前, 2小时前，3小时前
    let duration = (now - date) / 1000  // 秒

    console.log(duration);

    if (duration <= 15 * 60) {
        return '刚刚';
    }

    // 下面的几个语句，其实前半个分支都可以不要的，比如
    //  if (duration <= 30 * 60) {
    //    ...
    //  }
    if (duration > 15 * 60 && duration <= 30 * 60 ) {
        return '15 分钟之前';
    }

    if (duration > 30 * 60  && duration <= 60 * 60 ) {
        return '30 分钟之前';
    }

    if (duration > 60 * 60  && duration <= 60 * 60 * 2 ) {
        return '1 小时之前';
    }

    if (duration > 60 * 60 * 2  && duration <= 60 * 60 * 3 ) {
        return '2 小时之前';
    }

    if (duration > 60 * 60  && duration <= 60 * 60 * 4 ) {
        return '3 小时之前';
    }

    // 今天 17:22 昨天 15:22

    const dy = date.getFullYear();
    const ny = now.getFullYear();
    const dm = date.getMonth();
    const nm = now.getMonth();
    const dd = date.getDate();
    const nd = now.getDate();

    // 下面的一段代码，我觉得可以优化得更加简洁。
    // 可以尝试重构一下, 把函数代码重构到一屏之内
    if (dy === ny) {
        if (dm ===nm) {
            if (nd - dd === 0) {
                // 今天
                return `今天 ${date.getHours()}:${date.getMinutes()}`;
            }

            if (nd - dd === 1) {
                // 昨天
                return `昨天 ${date.getHours()}:${date.getMinutes()}`;
            }

            return `${date.getMonth() + 1}月${date.getDate()}日`;
        } else {
            return `${date.getMonth() + 1}月${date.getDate()}日`;
        }

    } else {
        return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    }
}
