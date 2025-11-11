using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using estoque_service.Data;

var builder = WebApplication.CreateBuilder(args);

// Registrar o DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=estoque.db"));

// Ativar CORS para o Angular
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy =>
        {
            policy.WithOrigins("http://localhost:4200")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Habilitar CORS
app.UseCors("AllowAngular");

app.UseHttpsRedirection();
app.MapControllers();
app.Run();
