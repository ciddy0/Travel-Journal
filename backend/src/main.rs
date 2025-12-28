use axum::{Router, routing::get};
mod location;

use location::{location_get, location_post};

#[tokio::main]

async fn main() {
    // 1. create the axum router
    let route01 = Router::new().route("/location", get(location_get).post(location_post));

    // 2. define the IP and port listener (TCP)
    let address = "0.0.0.0:8080";
    let listener = tokio::net::TcpListener::bind(address).await.unwrap();

    // 3. axum serve to launch the web server
    axum::serve(listener, route01).await.unwrap();
}
