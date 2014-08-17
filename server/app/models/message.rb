class Message < ActiveRecord::Base
  acts_as_paranoid

  belongs_to :user, primary_key: 'uid', foreign_key: 'from_uid'

  after_create :calculate_pn_value

  scope :today, lambda { where('sent_at BETWEEN ? AND ?', DateTime.now.beginning_of_day, DateTime.now.end_of_day) }

  private
    def calculate_pn_value
      require 'MeCab' # FIXME: not here
      pn_value = 0
      mecab = MeCab::Tagger.new("-Ochasen")
      node = mecab.parseToNode(self.body)
      prototypes = []
      while node
        prototype = node.feature.split(/,/)[6]
        prototypes.push(prototype) unless prototype == '*'
        node = node.next
      end

      pn_values = PnJpWord.where(word: prototypes).pluck(:value)
      pn_value = if pn_values.size > 0
                   pn_values.sum / pn_values.size.to_f
                 else
                   0
                 end
      self.update_attributes(pn_value: pn_value)
    end
end
