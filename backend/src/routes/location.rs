use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};
use uuid::Uuid;

use crate::{
    models::location::{CreateLocationRequest, LocationResponse, UpdateLocationRequest},
    services::location::LocationService,
};

pub async fn get_all_locations(
    State(service): State<LocationService>,
) -> Result<Json<Vec<LocationResponse>>, StatusCode> {
    let locations = service
        .get_all_locations()
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let response: Vec<LocationResponse> = locations
        .into_iter()
        .map(LocationResponse::from) // Use the From trait
        .collect();

    Ok(Json(response))
}

pub async fn create_location(
    State(service): State<LocationService>,
    Json(req): Json<CreateLocationRequest>,
) -> Result<Json<LocationResponse>, StatusCode> {
    let location = service
        .create_location(req)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(LocationResponse::from(location))) // Use the From trait
}

pub async fn get_location_by_id(
    State(service): State<LocationService>,
    Path(id): Path<Uuid>,
) -> Result<Json<LocationResponse>, StatusCode> {
    let location = service
        .get_location_by_id(id)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
        .ok_or(StatusCode::NOT_FOUND)?;

    Ok(Json(LocationResponse::from(location))) // Use the From trait
}

pub async fn update_location(
    State(service): State<LocationService>,
    Path(id): Path<Uuid>,
    Json(req): Json<UpdateLocationRequest>,
) -> Result<Json<LocationResponse>, StatusCode> {
    let location = service
        .update_location(id, req)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
        .ok_or(StatusCode::NOT_FOUND)?;

    Ok(Json(LocationResponse::from(location)))
}

pub async fn delete_location(
    State(service): State<LocationService>,
    Path(id): Path<Uuid>,
) -> Result<StatusCode, StatusCode> {
    service
        .delete_location(id)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(StatusCode::NO_CONTENT)
}
