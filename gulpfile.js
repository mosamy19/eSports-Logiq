var gulp = require("gulp");
var sftp = require("gulp-sftp");

gulp.task("prod", function () {
  return gulp.src("dist/**").pipe(
    sftp({
      host: "esports-10-www1.superhosting.cz",
      user: "cst-hockeylogic.cz",
      pass: "oB5YfDgR3U8h",
      remotePath: "/var/home/www/hockeylogic.cz/subdomains/www",
    })
  );
});

gulp.task("test", function () {
  return gulp.src("dist/**").pipe(
    sftp({
      host: "esports-10-www1.superhosting.cz",
      user: "cst-hockeylogic.cz",
      pass: "oB5YfDgR3U8h",
      remotePath: "/var/home/www/hockeylogic.cz/subdomains/test",
    })
  );
});

gulp.task("test_new", function () {
  return gulp.src("dist/**").pipe(
    sftp({
      host: "esports-10-www1.superhosting.cz",
      user: "cst-hockeylogic.cz",
      pass: "oB5YfDgR3U8h",
      remotePath: "/var/home/www/hockeylogic.cz/subdomains/test-new",
    })
  );
});

gulp.task("heatmap", function () {
  return gulp.src("heatmap_python/**").pipe(
    sftp({
      host: "esports-10-www1.superhosting.cz",
      user: "cst-hockeylogic.cz",
      pass: "oB5YfDgR3U8h",
      remotePath: "/var/home/www/hockeylogic.cz/subdomains/www/heatmap_python",
    })
  );
});

gulp.task("heatmap_test", function () {
  return gulp.src("heatmap_python/**").pipe(
    sftp({
      host: "esports-10-www1.superhosting.cz",
      user: "cst-hockeylogic.cz",
      pass: "oB5YfDgR3U8h",
      remotePath: "/var/home/www/hockeylogic.cz/subdomains/test/heatmap_python",
    })
  );
});

gulp.task("external_data", function () {
  return gulp.src("external_data/**").pipe(
    sftp({
      host: "esports-10-www1.superhosting.cz",
      user: "cst-hockeylogic.cz",
      pass: "oB5YfDgR3U8h",
      remotePath: "/var/home/www/hockeylogic.cz/subdomains/www/external_data",
    })
  );
});

gulp.task("video", function () {
  return gulp.src("video_player/**").pipe(
    sftp({
      host: "esports-10-www1.superhosting.cz",
      user: "cst-hockeylogic.cz",
      pass: "oB5YfDgR3U8h",
      remotePath: "/var/home/www/hockeylogic.cz/subdomains/www/video_player",
    })
  );
});

gulp.task("mock", function () {
  return gulp.src("mock/**").pipe(
    sftp({
      host: "esports-10-www1.superhosting.cz",
      user: "cst-hockeylogic.cz",
      pass: "oB5YfDgR3U8h",
      remotePath: "/var/home/www/hockeylogic.cz/subdomains/www/mock",
    })
  );
});

gulp.task("tracking_api", function () {
  return gulp.src("tracking_api/**").pipe(
    sftp({
      host: "esports-10-www1.superhosting.cz",
      user: "cst-hockeylogic.cz",
      pass: "oB5YfDgR3U8h",
      remotePath: "/var/home/www/hockeylogic.cz/subdomains/www/tracking_api",
    })
  );
});
