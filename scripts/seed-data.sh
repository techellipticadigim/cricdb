#!/bin/bash

echo "🏏 CricketDB Seed Data Script"
echo "=============================="

# Wait for backend to be ready
echo "⏳ Waiting for backend to be ready..."
until curl -f http://localhost:8080/actuator/health > /dev/null 2>&1; do
  echo "Backend not ready yet, waiting..."
  sleep 5
done

echo "✅ Backend is ready!"

# Function to make API calls
make_api_call() {
  local method=$1
  local endpoint=$2
  local data=$3
  local token=$4
  
  if [ -n "$token" ]; then
    curl -s -X $method \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $token" \
      -d "$data" \
      "http://localhost:8080/api$endpoint"
  else
    curl -s -X $method \
      -H "Content-Type: application/json" \
      -d "$data" \
      "http://localhost:8080/api$endpoint"
  fi
}

echo "🔐 Creating default users..."

# Register admin user
echo "Creating admin user..."
make_api_call "POST" "/auth/register" '{"email":"admin@cricketdb.com","password":"admin123"}'

# Login to get token
echo "Logging in as admin..."
LOGIN_RESPONSE=$(make_api_call "POST" "/auth/login" '{"email":"admin@cricketdb.com","password":"admin123"}')
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Failed to get authentication token"
  exit 1
fi

echo "✅ Authentication successful"

echo "👥 Creating sample players..."

# Create sample players
PLAYERS=(
  '{"playerName":"Virat Kohli","country":"India","startYear":2008,"gender":"MALE","role":"BATSMAN","notes":"Former Indian captain and one of the greatest batsmen"}'
  '{"playerName":"Steve Smith","country":"Australia","startYear":2010,"gender":"MALE","role":"BATSMAN","notes":"Former Australian captain, known for his unique batting technique"}'
  '{"playerName":"Joe Root","country":"England","startYear":2012,"gender":"MALE","role":"BATSMAN","notes":"Former English captain and prolific run scorer"}'
  '{"playerName":"Kane Williamson","country":"New Zealand","startYear":2010,"gender":"MALE","role":"BATSMAN","notes":"Former New Zealand captain, known for his calm batting"}'
  '{"playerName":"Babar Azam","country":"Pakistan","startYear":2015,"gender":"MALE","role":"BATSMAN","notes":"Current Pakistani captain and top-ranked batsman"}'
  '{"playerName":"Pat Cummins","country":"Australia","startYear":2011,"gender":"MALE","role":"BOWLER","notes":"Current Australian captain and fast bowler"}'
  '{"playerName":"Jasprit Bumrah","country":"India","startYear":2016,"gender":"MALE","role":"BOWLER","notes":"Indian fast bowler known for his unique action"}'
  '{"playerName":"James Anderson","country":"England","startYear":2003,"gender":"MALE","role":"BOWLER","notes":"English fast bowler and leading wicket-taker"}'
  '{"playerName":"Trent Boult","country":"New Zealand","startYear":2011,"gender":"MALE","role":"BOWLER","notes":"New Zealand left-arm fast bowler"}'
  '{"playerName":"Shaheen Afridi","country":"Pakistan","startYear":2018,"gender":"MALE","role":"BOWLER","notes":"Pakistani fast bowler"}'
  '{"playerName":"Ben Stokes","country":"England","startYear":2013,"gender":"MALE","role":"ALL_ROUNDER","notes":"English all-rounder and former captain"}'
  '{"playerName":"Ravindra Jadeja","country":"India","startYear":2012,"gender":"MALE","role":"ALL_ROUNDER","notes":"Indian all-rounder known for his fielding"}'
  '{"playerName":"Mitchell Marsh","country":"Australia","startYear":2011,"gender":"MALE","role":"ALL_ROUNDER","notes":"Australian all-rounder"}'
  '{"playerName":"Ellyse Perry","country":"Australia","startYear":2007,"gender":"FEMALE","role":"ALL_ROUNDER","notes":"Australian women cricketer, all-rounder"}'
  '{"playerName":"Smriti Mandhana","country":"India","startYear":2013,"gender":"FEMALE","role":"BATSMAN","notes":"Indian women cricketer, opening batsman"}'
)

for player in "${PLAYERS[@]}"; do
  echo "Adding player: $(echo $player | grep -o '"playerName":"[^"]*"' | cut -d'"' -f4)"
  make_api_call "POST" "/players" "$player" "$TOKEN" > /dev/null
done

echo "✅ Sample players created!"

echo "📊 Adding sample statistics..."

# Add some batting statistics
BATTING_STATS=(
  '{"playerId":1,"runs":120,"ballsPlayed":140,"sixes":2,"fours":12,"against":"Australia","matchDate":"2023-01-15"}'
  '{"playerId":1,"runs":85,"ballsPlayed":95,"sixes":1,"fours":8,"against":"England","matchDate":"2023-02-20"}'
  '{"playerId":1,"runs":156,"ballsPlayed":180,"sixes":3,"fours":15,"against":"New Zealand","matchDate":"2023-03-10"}'
  '{"playerId":2,"runs":110,"ballsPlayed":125,"sixes":1,"fours":10,"against":"India","matchDate":"2023-01-20"}'
  '{"playerId":3,"runs":78,"ballsPlayed":90,"sixes":0,"fours":7,"against":"Australia","matchDate":"2023-02-15"}'
)

for stat in "${BATTING_STATS[@]}"; do
  echo "Adding batting stat..."
  make_api_call "POST" "/stats/batting" "$stat" "$TOKEN" > /dev/null
done

# Add some bowling statistics
BOWLING_STATS=(
  '{"playerId":6,"overs":10.0,"maidens":2,"runsGiven":45,"wicketsTaken":4,"against":"India","matchDate":"2023-01-15"}'
  '{"playerId":7,"overs":9.0,"maidens":1,"runsGiven":42,"wicketsTaken":5,"against":"Australia","matchDate":"2023-01-20"}'
  '{"playerId":8,"overs":12.0,"maidens":4,"runsGiven":48,"wicketsTaken":3,"against":"Australia","matchDate":"2023-02-15"}'
  '{"playerId":9,"overs":9.5,"maidens":2,"runsGiven":40,"wicketsTaken":4,"against":"Pakistan","matchDate":"2023-02-25"}'
  '{"playerId":10,"overs":8.0,"maidens":1,"runsGiven":36,"wicketsTaken":5,"against":"England","matchDate":"2023-03-05"}'
)

for stat in "${BOWLING_STATS[@]}"; do
  echo "Adding bowling stat..."
  make_api_call "POST" "/stats/bowling" "$stat" "$TOKEN" > /dev/null
done

echo "✅ Sample statistics added!"

echo ""
echo "🎉 Seed data setup complete!"
echo ""
echo "📱 You can now access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8080"
echo "   Swagger UI: http://localhost:8080/swagger-ui.html"
echo ""
echo "🔐 Demo Credentials:"
echo "   Admin: admin@cricketdb.com / admin123"
echo "   (You can create additional users through the admin panel)"
echo ""
