<template>
  <footer class="bg-dark text-light pt-5 pb-3 mt-auto">
    <div class="container">
      <div class="row g-4">

        <div class="col-12 mt-4">
          <h5 class="text-uppercase mb-3">Newsletter</h5>
          <p class="text-secondary">Stay updated with the latest news from GaNews</p>
          <form class="d-flex w-100" @submit.prevent>
            <input type="email" class="form-control me-2" placeholder="Enter your email" required />
            <button class="btn btn-info text-white" type="submit"><i class="bi bi-envelope"></i></button>
          </form>
        </div>

        <div class="col-md-4 col-lg-2">
          <h5 class="text-uppercase mb-3">News Categories</h5>
          <ul class="list-unstyled">
            <li><a href="#" class="text-secondary text-decoration-none d-block py-1">World News</a></li>
            <li><a href="#" class="text-secondary text-decoration-none d-block py-1">Sports</a></li>
            <li><a href="#" class="text-secondary text-decoration-none d-block py-1">Technology</a></li>
          </ul>
        </div>

        <div class="col-md-4 col-lg-2">
          <h5 class="text-uppercase mb-3">Support</h5>
          <ul class="list-unstyled">
            <li><a href="#" class="text-secondary text-decoration-none d-block py-1">FAQ</a></li>
            <li><a href="#" class="text-secondary text-decoration-none d-block py-1">Contact Us</a></li>
            <li><a href="#" class="text-secondary text-decoration-none d-block py-1">Subscribe</a></li>
            <li><a href="#" class="text-secondary text-decoration-none d-block py-1">Privacy Policy</a></li>
          </ul>
        </div>

        <div class="col-md-4 col-lg-2">
          <h5 class="text-uppercase mb-3">About GaNews</h5>
          <ul class="list-unstyled">
            <li><a href="#" class="text-secondary text-decoration-none d-block py-1">Our Story</a></li>
            <li><a href="#" class="text-secondary text-decoration-none d-block py-1">Latest Updates</a></li>
            <li><a href="#" class="text-secondary text-decoration-none d-block py-1">Careers</a></li>
            <li><a href="#" class="text-secondary text-decoration-none d-block py-1">Advertise</a></li>
          </ul>
        </div>

        <div class="col-md-6 col-lg-4">
          <h5 class="text-uppercase mb-3">Location</h5>
          <div class="ratio ratio-16x9 rounded shadow-sm">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.214912934534!2d106.71972251125314!3d10.794845339310697!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317527c2f8f30911%3A0x36ac5073f8c91acd!2sLandmark%2081!5e0!3m2!1svi!2s!4v1717698762222!5m2!1svi!2s"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              style="border:0;"
            ></iframe>
          </div>
        </div>

        <div class="col-md-6 col-lg-2">
          <h5 class="text-uppercase mb-3">Follow Us</h5>
          <div class="d-flex gap-2">
            <a href="#" class="btn btn-outline-light btn-sm rounded-circle"><i class="bi bi-facebook"></i></a>
            <a href="#" class="btn btn-outline-light btn-sm rounded-circle"><i class="bi bi-twitter-x"></i></a>
            <a href="#" class="btn btn-outline-light btn-sm rounded-circle"><i class="bi bi-instagram"></i></a>
          </div>
        </div>

      </div>

      <hr class="my-4 border-secondary" />
      <div class="text-center small">
        © 2025 GaNews. All Rights Reserved. |
        <a href="#" class="text-info text-decoration-none">Terms</a> |
        <a href="#" class="text-info text-decoration-none">Privacy</a> |
        <a href="#" class="text-info text-decoration-none">Contact</a>
      </div>
    </div>
  </footer>
</template>
