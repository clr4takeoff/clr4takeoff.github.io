(function () {
  const sidebar = document.querySelector(".sidebar.sticky");
  const content = document.querySelector("#main > .archive, #main > .page");
  if (!sidebar || !content) return;

  // 본문이 사이드바보다 짧으면 따라다니지 않고 제자리에 전체를 보여준다
  function update() {
    const needsFollow = content.offsetHeight > sidebar.scrollHeight;
    sidebar.classList.toggle("sidebar--static", !needsFollow);
  }

  update();
  window.addEventListener("load", update);
  window.addEventListener("resize", update);
  if (window.ResizeObserver) new ResizeObserver(update).observe(content);
})();
