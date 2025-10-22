#!/bin/bash

# CyberSource Sandbox Environment Setup Script
# This script helps you set up environment variables for testing

echo "🚀 CyberSource Sandbox Environment Setup"
echo "========================================="
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file for CyberSource credentials..."
    cat > .env << EOF
# CyberSource Sandbox Credentials
# Get these from your CyberSource Business Center account

CYBERSOURCE_MERCHANT_ID=your_merchant_id_here
CYBERSOURCE_API_KEY=your_api_key_here
CYBERSOURCE_SHARED_SECRET=your_shared_secret_here
CYBERSOURCE_ENVIRONMENT=sandbox

# Optional: Uncomment for production
# CYBERSOURCE_ENVIRONMENT=production
EOF
    echo "✅ Created .env file"
    echo ""
else
    echo "📄 .env file already exists"
    echo ""
fi

echo "📋 Next Steps:"
echo "1. Edit the .env file with your actual CyberSource sandbox credentials"
echo "2. You can get these credentials from:"
echo "   - CyberSource Business Center (ebctest.cybersource.com for sandbox)"
echo "   - Account Management > Key Management"
echo ""
echo "3. Run the sandbox test:"
echo "   source .env && npx ts-node test-sandbox-api.ts"
echo ""
echo "4. Or export variables manually:"
echo "   export CYBERSOURCE_MERCHANT_ID=your_merchant_id"
echo "   export CYBERSOURCE_API_KEY=your_api_key"
echo "   export CYBERSOURCE_SHARED_SECRET=your_shared_secret"
echo "   npx ts-node test-sandbox-api.ts"
echo ""
echo "📚 For more information, see:"
echo "   - CyberSource Developer Center: developer.cybersource.com"
echo "   - API Reference: developer.cybersource.com/api-reference-assets"
echo ""