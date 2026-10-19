    
using BuyOrWait.Application.Auth;   
using BuyOrWait.Application.Forecasting;
using BuyOrWait.Infrastructure.Auth;
using BuyOrWait.Infrastructure.Forecasting;
using BuyOrWait.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using System.Text;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddDbContext<AppDbContext>(options=>options.UseSqlServer(builder.Configuration.GetConnectionString("Default")));
builder.Services.AddScoped<IPasswordHasher, BCryptPasswordHasher>();
builder.Services.AddScoped<ITokenService, JwtTokenService>();
builder.Services.AddScoped<IRecommendationNarrator, OllamaRecommendationNarrator>();
builder.Services.AddScoped<ITracer, ListTracer>();
builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    { 
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "Jwt",
        In = ParameterLocation.Header,
        Description = "Paste your JWT here (no need to type 'Bearer')."

    });
    c.AddSecurityRequirement(document => new OpenApiSecurityRequirement
    {
        [new OpenApiSecuritySchemeReference("Bearer", document)] = []
    });

});

var jwt = builder.Configuration.GetSection("Jwt");

// Fail fast: refuse to start without a real signing key.
var jwtKey = jwt["Key"];
if (string.IsNullOrWhiteSpace(jwtKey) || jwtKey.Length < 32)
{
    throw new InvalidOperationException(
        "Jwt:Key is missing or too short. Set it with: dotnet user-secrets set \"Jwt:Key\" \"<value>\"");
}

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(Options =>
                {
                    Options.MapInboundClaims = false;
                    Options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = jwt["Issuer"],
                        ValidAudience = jwt["Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
                    };
                });
builder.Services.AddCors(options =>
{
    options.AddPolicy("Allowfrontend", policy =>
                       policy.WithOrigins("http://localhost:5173")
                       .AllowAnyHeader()
                       .AllowAnyMethod()
                       );
}
    );


var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("Allowfrontend");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
