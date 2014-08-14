class MessageSerializer < ActiveModel::Serializer
  attributes :id, :body, :pn_value, :sent_at
end
