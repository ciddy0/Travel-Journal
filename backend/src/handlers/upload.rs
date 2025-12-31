use axum::{Json, extract::Multipart, http::StatusCode};

use image::{GenericImageView, ImageReader};
use std::{io::Cursor, path::Path};
use tokio::fs;
use uuid::Uuid;

const MAX_FILE_SIZE: usize = 5 * 1024 * 1024; // 5MB
const MAX_WIDTH: u32 = 4096;
const MAX_HEIGHT: u32 = 4096;

#[derive(serde::Serialize)]
pub struct UploadResponse {
    pub image_url: String,
}

pub async fn upload_image(mut multipart: Multipart) -> Result<Json<UploadResponse>, StatusCode> {
    let field = multipart
        .next_field()
        .await
        .map_err(|_| StatusCode::BAD_REQUEST)?
        .ok_or(StatusCode::BAD_REQUEST)?;

    let content_type = field.content_type().map(|s| s.to_string());

    // read file bytes XD
    let data = field.bytes().await.map_err(|_| StatusCode::BAD_REQUEST)?;

    if data.len() > MAX_FILE_SIZE {
        return Err(StatusCode::PAYLOAD_TOO_LARGE);
    }

    // validate image :o
    let img = ImageReader::new(Cursor::new(&data))
        .with_guessed_format()
        .map_err(|_| StatusCode::UNSUPPORTED_MEDIA_TYPE)?
        .decode()
        .map_err(|_| StatusCode::UNSUPPORTED_MEDIA_TYPE)?;

    let (width, height) = img.dimensions();
    if width > MAX_WIDTH || height > MAX_HEIGHT {
        return Err(StatusCode::BAD_REQUEST);
    }

    // lets make a file name hehe
    let ext = content_type
        .as_deref()
        .and_then(|ct| ct.split('/').last())
        .unwrap_or("png");

    let filename = format!("{}.{}", Uuid::new_v4(), ext);
    let upload_dir = Path::new("uploads");
    let path = upload_dir.join(&filename);

    // make sure directory exist </3
    fs::create_dir_all(upload_dir)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    // ---- Save file ----
    fs::write(&path, &data)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(UploadResponse {
        image_url: format!("/uploads/{}", filename),
    }))
}
