json.array!(@messages) do |message|
  json.extract! message, :id, :to_uid, :body, :raw_body, :pn_value, :opened_at, :sent_at
  json.url message_url(message, format: :json)
end
